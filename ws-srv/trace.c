#include <string.h>
#include <stdio.h>
#include <time.h>

char *gpszLogTitle = "chess-srv.log";

void vTrace(char *szStaticMsg){
    FILE *pfLog;
    time_t lTime;
    struct tm *now;
    char szLogTitle[256];

    sprintf(szLogTitle, "%s", gpszLogTitle);
    if ( (pfLog = fopen(szLogTitle, "a")) == NULL )
        return;

    time(&lTime);
    now = localtime(&lTime);
    fprintf(pfLog,"%02d/%02d/%04d %02d:%02d:%02d %s\n",
      now->tm_mday,
      now->tm_mon + 1,
      now->tm_year + 1900,
      now->tm_hour,
      now->tm_min,
      now->tm_sec,
      szStaticMsg      
    );
    fclose(pfLog);
}
void vTraceStr(char *szStaticMsg, char *szFormattedMsg){
    FILE *pfLog;
    time_t lTime;
    struct tm *now;
    char szLogTitle[256];

    sprintf(szLogTitle, "%s", gpszLogTitle);
    if ( (pfLog = fopen(szLogTitle, "a")) == NULL )
        return;

    time(&lTime);
    now = localtime(&lTime);
    fprintf(pfLog,"%02d/%02d/%04d %02d:%02d:%02d %s %s\n",
      now->tm_mday,
      now->tm_mon + 1,
      now->tm_year + 1900,
      now->tm_hour,
      now->tm_min,
      now->tm_sec,
      szStaticMsg,
      szFormattedMsg
      
    );
    fclose(pfLog);
}