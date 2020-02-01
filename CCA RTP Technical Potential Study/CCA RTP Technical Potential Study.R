library(tidyverse)
library(lubridate)
library(jsonlite)

options(scipen = 999)

setwd("~/Library/Mobile Documents/com~apple~CloudDocs/Ryan's Stuff/2020/GridShift Hackathon 2020/gsprojectodin/CCA RTP Technical Potential Study")

Code_WD <- getwd()

setwd("../")

Home_WD <- getwd()



#### Load and Clean CAISO RT5M Wholesale Price Data ####






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








