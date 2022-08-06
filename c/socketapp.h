//sor.h

#define CURSOR_PATCH 'I'
#define CURSOR_REAL_PATCH "018"

// number of children we are able to control
#define MAX_CHILDREN_CONTROL 128
// number of IPs in IP_LIST table
#define MAX_IP_CTL           128
// number of transactions for repeated message control
#define MAX_TRANSACTION_CONTROL 1024

typedef struct
{
  int                       iNextInsert;
  long                      alTransaction[MAX_TRANSACTION_CONTROL];
}
  STRUCT_TRANSACTION_CTL;

typedef struct STRUCT_PRUNE_FILE
{
  char* pszFileName;
  long lMTime;
  struct STRUCT_PRUNE_FILE* pNext;
  struct STRUCT_PRUNE_FILE* pPrev;
}
  STRUCT_PRUNE_FILE;

typedef struct
{
  int iCtr;
  STRUCT_PRUNE_FILE* pFirst;
  STRUCT_PRUNE_FILE* pLast;
}
  STRUCT_PRUNE_FILE_LIST;

//////////////////////////////////////////////////////////////////////////////
//
//  Defines
//

#define CURSOR_CMDLINEOPT_VERSION astCmdOpt[3]
#define PARENT_VERSION astCmdOpt[5]
#define FIX_TIME astCmdOpt[6]
#define FIX_TIME_FILE astCmdOpt[9]

#define POS_STATUS_NOTIFY_OPTION_BACKUP 0x01

//////////////////////////////////////////////////////////////////////////////
//
//  Globals
//

// Command line parameters
extern STRUCT_CMDLINE gstCmdLine;

// Global parameters
extern STRUCT_GLOBAL_PRM gstGlobalPrm;

extern STRUCT_CURSOR_SCOREBOARD gstCursorScoreBoard;

// repeated message control
extern STRUCT_TRANSACTION_CTL gstTransactionControl;

// Zone difference in seconds from UTC
extern int giTZ_Delta;

// signals
extern int gbStop;


int iProcessUdpMsg(char* achBuffer, int iBytes, char*szPeerIP);
int iProcessStreamCmd(char* szMsg);
int iProcessTicTac();
