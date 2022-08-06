#define OSSOCKET_BINARY     0
#define OSSOCKET_ASCII      1

#define FILE_2_MEM_EXT_OPTION_LOCK   0x01

#include <sys/utime.h>

/////////////////////////////////////////////////// Types

typedef struct tm struct_tm;

typedef struct {
  char szPath[260];
  int iOptions;
  char* pszData;
  long lBytes;
  int pf;
}
  STRUCT_FILE2MEM_EXT;

/////////////////////////////////////////////////// Globals

// incremented every time iOS_ConnectStreamSocket is called
extern unsigned long ulConnectCt;

// Send socket error message to iStreamMessage
extern int giSendErrorMessage;

// signals
extern int gbStop;
extern int gbReload;
extern int giSigChild;
extern int giSigQUIT;
extern int giSigTERM;
extern int giSigPipeCtr;

extern char gszCursorPrompt[64];

extern char* gpszArgv0;

/////////////////////////////////////////////////// Procedures

int iOS_LoadSerialPrms();
int iOS_Init();
char* pszOS_LoadInfo();

int iOS_CatchSigPipe();
int iOS_CatchSigUsr1();
int iOS_CatchSigUsr2();

void vSleepMillisec(unsigned long ulMillisec);
int iOS_SetTime(struct_tm *now);

int iOS_CreateStreamSocket();
int iOS_SetSocketMode(int iSock, int iMode);
int iOS_ConnectStreamSocket(int iSock, char* szIP, int iPort, int iTimeout);
int iOS_ListenStreamSocket(int iSock, int iPort);
int iOS_WaitConnectStreamSocket(int iSock, int iTimeout);
int iOS_CloseStreamSocket(int iSock);
int iOS_ReadStreamSocket(int iSock, char* achBuf, int iSize, int iTimeout);
int iOS_ReadStreamSocketDlm(int iSock, char* achBuf, int iSize, int iTimeout, int iDlm);
int iOS_ExtReadStreamSocket(int iSock, char* achBuf, int iSize, int iTimeout);
int iOS_WriteStreamSocket(int iSock, char* achBuf, int iSize);
int iOS_SockTest(char *szIP);
int iOS_SetNetStatus(int ii);
int iOS_GetNetStatus();

int iOS_StopProcess(int pid, int iShutdownTimeout);
int iOS_SendReload(int pid);
int iOS_Finish();

// return TRUE if device is ready to receive
int iOS_SerialReadyToReceive(int iPort);
int iOS_SerialGarbageCollect(int iPort);
int iOS_SerialGetByte(int iPort);
int iOS_SerialSendString(int iPort, char* szString);
int iOS_SerialSendByte(int iPort, unsigned char chByte);
int iOS_SerialSendBytes(int iPort, unsigned char* achBytes, int iPrmBytes);
int iOS_SerialGetString(
  int iPort,
  char* szString,
  int iBytes,
  int iDlm,
  long lDelay,
  long lTimeout
);
int iOS_SerialEnable(int iPort);
int iOS_SerialDisable(int iPort);
int iOS_SerialReadDSR(int iPort);
int iOS_SerialReadCTS(int iPort);
int iOS_SerialClose(int iPort);

int iOS_PkgScriptGen(char* szDir, char* szName, char* szExt);

int iOS_ResetSockets();

int iOS_Prune(int iDirs, int iTars);

int iOS_SetDefaultDisplayLogFileName(char* szName);

int iOS_CreateUdpSocket();
// int iOS_GetSockName(SOCKET iSocket, char* szMyIP);
int iOS_GetUdpMsg(int hSocketUDP, char *pszMsg, int iPrmBytes, void* pFrom, int* piFrom);
int iOS_SendUdpMsg(int hSocketUDP, char *pszMsg, int iPrmBytes, void* pFrom, int iFrom);
int iOS_UdpQuery(char* szIP, int iPort, char* szCmd, char* szRsl, int iRslLen, long lTimeout);
int iOS_UdpCmd(int hUDP_Socket, char *pszMsg, int iPrmBytes);

int iOS_Process(char* szCmd);
int iOS_ExternalCommand(char* szPrmCmd);
int iOS_ExternalCommandExt(char* szCmd, int* piExitStatus, char* szPrmRsl, unsigned int uRslBytes);
int iOS_ExternalController(char* szPrmCmd, int* piHandle);

int iOS_DoBackupDB(char* szPrmPrefix, char* szPrmFileList, int iPrmMax);

int iOS_GetPid();

void vOS_Tic(unsigned long ulMillisec);

long lFile2MemExt(STRUCT_FILE2MEM_EXT* pstPrm);
long lFile2MemExtReplace(STRUCT_FILE2MEM_EXT* pstPrm, long lBytes, char* ach);
void vFile2MemExtClose(STRUCT_FILE2MEM_EXT* pstPrm);

int iSetup();
void vShutdown();

int iServerSetup(int iPort);
int iServerWaitAndHandleEvent();
void vServerShutdown();

void vTraceSocketMsg(char* szMsg, char* achBuf);
void vTraceSocketMsgWithPid(char* szFormat, char* achBuf);

int hOS_LockFile(char* szFile);
int bOS_UnlockFile(int hLock);
int hOS_ExtraLockDir(char* szDir, char* szLockName);
int bOS_ExtraUnlockDir(int hExtraLock);
int iGetActiveLock(char* szName);
void vCheckVenditorPid();
int iWriteMyPid(char* szWrkDir, char* szName);
int iRemoveMyPid(char* szWrkDir, char* szName);
int iOS_Fork();

