#define MAX_CHILDREN_CONTROL 128
// number of IPs in IP_LIST table
#define MAX_IP_CTL           128

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <math.h>

#  include <crtdbg.h>
#  include <winsock2.h>
#  include <windows.h>
#  include <errno.h>
#  include <stdio.h>
#  include <stdlib.h>
#  include <string.h>
#  include <io.h>
#  include <process.h>
#  include <sys/timeb.h>
#  include <sys/types.h>
#  include <sys/stat.h>
#  define pipe _pipe
#  define popen _popen
#  define pclose _pclose

#include "socketsrv.h"
#include "socketapp.h"

long glCurrentTime;
/////////////////////////////////////////////////////////////////////////////
//
//  main
//

int main(int argc, char *argv[])
{

  int iRsl = 0;
  int iEventRsl;
  char* pEnv;

  time(&glCurrentTime);
  
  gpszArgv0 = argv[0];

  if ( (iRsl = iServerSetup(8601)) > 0 ) {
    return iRsl;
  }
  

  return 0;
}