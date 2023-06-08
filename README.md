## docker hub下載
docker pull alan78814/ezdemandtest

## container my_ezdemandtest
 docker run -d --name my_ezdemandtest -p 8081:3000 alan78814/ezdemandtest  

## 安裝Watchtower
docker pull containrrr/watchtower

## 啟動Watchtower 60監控指定的容器
docker run -d --name watchtower -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --interval 60 --cleanup --monitor-only --debug my_ezdemandtest


