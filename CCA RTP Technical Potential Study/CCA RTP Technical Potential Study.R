library(tidyverse)
library(lubridate)
library(jsonlite)

options(scipen = 999)

setwd("~/Library/Mobile Documents/com~apple~CloudDocs/Ryan's Stuff/2020/GridShift Hackathon 2020/gsprojectodin/CCA RTP Technical Potential Study")

Code_WD <- getwd()

setwd("../")

Home_WD <- getwd()



#### Load and Clean CAISO RT5M Wholesale Price Data ####
# Data is for PG&E DLAP, Real-Time 5-Minute Market

setwd(file.path(Home_WD, "CAISO RT5M Price Data"))

CAISO_RT5M_Files <- list.files(pattern = ".csv")

Raw_CAISO_RT5M_Joined <- data.frame(INTERVALSTARTTIME_GMT = character(), VALUE = numeric(), stringsAsFactors = F)
  
for(CAISO_RT5M_File in CAISO_RT5M_Files){
  
  Raw_CAISO_RT5M_Single <- read.csv(CAISO_RT5M_File) %>%
    filter(XML_DATA_ITEM == "LMP_PRC") %>%
    select(INTERVALSTARTTIME_GMT, VALUE)
  
  Raw_CAISO_RT5M_Joined <- rbind(Raw_CAISO_RT5M_Joined, Raw_CAISO_RT5M_Single)
  
}

rm(Raw_CAISO_RT5M_Single, CAISO_RT5M_File, CAISO_RT5M_Files)

Clean_CAISO_RT5M_Joined <- Raw_CAISO_RT5M_Joined %>%
  mutate(dttm = as.POSIXct(gsub("T", " ", substr(INTERVALSTARTTIME_GMT, 1, 16)), tz = "UTC")) %>%
  mutate(dttm = with_tz(dttm, tz = "America/Los_Angeles")) %>%
  mutate(LMP_RT5M = VALUE/1000) %>% # Convert from $/MWh to $/kWh
  select(dttm, LMP_RT5M) %>%
  arrange(dttm)

rm(Raw_CAISO_RT5M_Joined)


#### Load, Clean, and Interpolate CAISO Demand Data ####

setwd(file.path(Home_WD, "CAISO_Actual_Demand_Data"))

CAISO_Demand_Files <- list.files(pattern = ".csv")

Raw_CAISO_Demand_Joined <- data.frame(INTERVALSTARTTIME_GMT = character(), MW = numeric(), stringsAsFactors = F)

for(CAISO_Demand_File in CAISO_Demand_Files){
  
  Raw_CAISO_Demand_Single <- read.csv(CAISO_Demand_File) %>%
    filter(TAC_AREA_NAME == "PGE-TAC") %>%
    select(INTERVALSTARTTIME_GMT, MW)
  
  Raw_CAISO_Demand_Joined <- rbind(Raw_CAISO_Demand_Joined, Raw_CAISO_Demand_Single)
  
}

rm(Raw_CAISO_Demand_Single, CAISO_Demand_File, CAISO_Demand_Files)

Clean_CAISO_Demand_Joined <- Raw_CAISO_Demand_Joined %>%
  mutate(dttm = as.POSIXct(gsub("T", " ", substr(INTERVALSTARTTIME_GMT, 1, 16)), tz = "UTC")) %>%
  mutate(dttm = with_tz(dttm, tz = "America/Los_Angeles")) %>%
  mutate(PGE_Demand_MW = MW) %>% # Convert from $/MWh to $/kWh
  select(dttm, PGE_Demand_MW) %>%
  arrange(dttm)

rm(Raw_CAISO_Demand_Joined)

Interpolated_CAISO_Demand <- approx(Clean_CAISO_Demand_Joined$dttm, Clean_CAISO_Demand_Joined$PGE_Demand_MW, 
                                     Clean_CAISO_RT5M_Joined$dttm, method="constant", rule = 2, f = 0)

CAISO_RT5M_Demand <- Clean_CAISO_RT5M_Joined %>%
  mutate(PGE_Demand_MW = Interpolated_CAISO_Demand$y)

rm(Interpolated_CAISO_Demand, Clean_CAISO_Demand_Joined, Clean_CAISO_RT5M_Joined)



#### Load and Clean WattTime SGIP Historical GHG Data ####

setwd(file.path(Home_WD, "WattTime SGIP Historical GHG Data"))

WattTime_Files <- list.files(pattern = ".json")

Raw_WattTime_Joined <- data.frame(point_time = character(), moer = numeric(), version = numeric(), 
                                  freq = numeric(), ba = character(), stringsAsFactors = F)

for(WattTime_File in WattTime_Files){

Raw_WattTime_Single <- read_json(WattTime_File, simplifyVector = TRUE)

Raw_WattTime_Joined <- rbind(Raw_WattTime_Joined, Raw_WattTime_Single)

}

rm(Raw_WattTime_Single, WattTime_File, WattTime_Files)

Clean_WattTime_Joined <- Raw_WattTime_Joined %>%
  mutate(dttm = as.POSIXct(gsub("T", " ", substr(point_time, 1, 16)), tz = "UTC")) %>%
  mutate(dttm = with_tz(dttm, tz = "America/Los_Angeles")) %>%
  select(dttm, moer) %>%
  group_by(dttm) %>%
  summarize(moer = mean(moer))

rm(Raw_WattTime_Joined)

# 3 datapoints are missing
Complete_WattTime_Joined <- data.frame(dttm = seq.POSIXt(from = as.POSIXct("2019-01-01 00:00", tz = "America/Los_Angeles"),
                                                         to = as.POSIXct("2019-12-31 23:55", tz = "America/Los_Angeles"),
                                                         by = "5 min")) %>%
  left_join(Clean_WattTime_Joined, by = "dttm") %>%
  mutate(moer = ifelse(is.na(moer), lag(moer, 12*24*7), moer)) # Fill with data from prior week.

rm(Clean_WattTime_Joined)


#### Join CAISO and WattTime Data ####

Joined_CAISO_WT <- CAISO_RT5M_Demand %>%
  left_join(Complete_WattTime_Joined, by = "dttm")

rm(CAISO_RT5M_Demand, Complete_WattTime_Joined)

# saveRDS(Joined_CAISO_WT, file.path(Code_WD, "Joined_CAISO_WattTime_2019.rds"))
# Joined_CAISO_WT <- readRDS(file.path(Code_WD, "Joined_CAISO_WattTime_2019.rds"))


#### Estimate SVCE Total Demand ####
# This data is not publicly available, so estimated using PG&E-TAC demand data from CAISO
# scaled to match SVCE Oct 1, 2017 – Sept 30, 2018 annual load of 3.6 TWh/year given in Feb 2019 Board Workshop presentation, pg. 38.
# https://www.svcleanenergy.org/wp-content/uploads/2019/02/Feb-2019-Board-Workshop_02-25-19-F.pdf

Total_2019_PGE_TWh <- sum(Joined_CAISO_WT$PGE_Demand_MW)/(12 * 1000 * 1000) # 99 TWh

Total_2017_2018_SVCE_TWh <- 3.6 # Total annual laod, in TWh

Joined_CAISO_WT <- Joined_CAISO_WT %>%
  mutate(SVCE_Demand_MW = PGE_Demand_MW * (Total_2017_2018_SVCE_TWh/Total_2019_PGE_TWh))


#### Estimate Modified SVCE Load Profile ####
# Assume that 50% of customers would be willing to switch to RTP rate (Innovators + Early Adopters + Early Majority)
# Assume price elasticity of -0.2 (http://files.brattle.com/files/13955_estimating_the_impact_of_innovative_rate_designs.pdf, pg. 43)

# Calculate average daily load.
# Calculate average daily price.
# Calculate % deviation from average daily price.
# Multiply by 50% and -20% to get % change in load.
# Multiply by average daily load to get MW change in load. (Check that this column sums to 0 MW).
# Add to original load profile to get modified load profile.

Joined_CAISO_WT <- Joined_CAISO_WT %>%
  group_by(Date = as.Date(dttm, tz = "America/Los_Angeles")) %>%
  mutate(Average_Daily_Demand = mean(SVCE_Demand_MW)) %>%
  mutate(Average_Daily_Price = mean(LMP_RT5M)) %>%
  ungroup() %>%
  mutate(Percent_Deviation_From_Average_Daily_Price = (LMP_RT5M - Average_Daily_Price)/Average_Daily_Price) %>%
  mutate(Demand_Change_Percent = 0.5 * -0.2 * Percent_Deviation_From_Average_Daily_Price) %>%
  mutate(Demand_Change_Percent = pmax(Demand_Change_Percent, -0.5)) %>% # Demand can be reduced by no more than 50%.
  mutate(Demand_Change_Percent = pmin(Demand_Change_Percent, 0.5)) %>% # Demand can be increased by no more than 50%.
  mutate(Demand_Change_MW = Demand_Change_Percent * Average_Daily_Demand) %>%
  mutate(Modified_SVCE_Demand_MW = SVCE_Demand_MW + Demand_Change_MW)

Selected_Plot_Date <- as.Date("2019-06-11", tz = "America/Los_Angeles")

ggplot(Joined_CAISO_WT %>% filter(Date == Selected_Plot_Date), aes(x = dttm)) + 
  geom_line(aes(y = SVCE_Demand_MW, color = "Original SVCE Demand")) + 
  geom_line(aes(y = Modified_SVCE_Demand_MW, color = "With 50% RTP Customers")) +
  xlab("Date-Time") +
  ylab("SVCE Demand (MW)") +
  ylim(0, max(Joined_CAISO_WT$SVCE_Demand_MW)) +
  labs(color = "Legend") +
  ggtitle("Modeled SVCE RTP Load Profile Impact") +
  theme(text = element_text(size = 15), plot.title = element_text(hjust = 0.5))

ggsave(filename = file.path(Code_WD, "SVCE Technical Potential Study Load Profile Plot 2019-06-11.png"),
       width = 11, height = 8.5, units = "in")
