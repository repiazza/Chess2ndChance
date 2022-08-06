#define SOCKET_WAIT_CLOSED
#define SOCKET_READ
#define SOCKET_BUFFER

#define UDP_QUERY_TIMEOUT_SECS 10

#include <winsock2.h>
#include <windows.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <io.h>
#include <fcntl.h>
#include <sys/timeb.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <process.h>
#define pipe _pipe
#define popen _popen
#define pclose _pclose
#define write _write


#include <time.h>
#define tzset _tzset

#include "socketapp.h"
#include "socketsrv.h"

//////////////////////////////////////////////////////////////////////////////
//
//                                      General
//
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//
//  Globals
//

// Zone difference in minutes from UTC (Sao Paulo: 180)
int giTZ_Delta;

// Send socket error message to iStreamMessage
int giSendErrorMessage = FALSE;

// signals
int gbStop = FALSE;
int gbReload = FALSE;
int giSigChild = FALSE;
int giSigQUIT = FALSE;
int giSigTERM = FALSE;
int giSigPipeCtr = 0;

char gszCursorPrompt[64] = "cursor:";

// socket para receber mensagens de controle
char gachUDP_ControlFrom[32];
int giUDP_ControlFrom;

// meu nome vis?vel
char* gpszArgv0 = NULL;

#ifdef _WIN32
//////////////////////////////////////////////////////////////////////////////
//
//                                      Win32
//
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//
//  Globals
//

//////////////////////////////////////////////////////////////////////////////
//
//  Local variables and constants
//

int giMyPid = 0;

int bSocketsOK = FALSE;
fd_set active_fd_set, read_fd_set;
fd_set listen_fd_set;

WSAEVENT hUDPSockEvnt = NULL;
WSAEVENT hStreamSockEvnt = NULL;
WSAEVENT ghServerStopEvent = NULL;

HANDLE hEvents[4] = {NULL, NULL, NULL, NULL};

SOCKET ghSocketUDP;
struct sockaddr_in gstSockInUDP;
struct sockaddr    gstSockAddrUDP;

SOCKET ghListen;
SOCKADDR_IN gstAddrStream;
SOCKET ghAccept;

unsigned int gnThreadId;    // ultimo thread iniciado
typedef struct
{
  SOCKET hSocket;
}
  STRUCT_STREAM;

void vTraceSocketMsgWithPid(char* szFormat, char* achBuf) // WIN32
{
  char szWrk[1024];
  sprintf(szWrk, "%5d %s", giMyPid, szFormat);
  vTraceSocketMsg(szWrk, achBuf);
}

// 0: OK
int iSetup() // WIN32
{
  struct timeb tstruct;
  WSADATA gwsaData;
  WORD wVersionRequested;

  // time zone
  tzset();
  ftime(&tstruct);
  giTZ_Delta = tstruct.timezone;

  // setup de TCP/IP
  wVersionRequested = MAKEWORD(1,1);
  if ( WSAStartup(wVersionRequested, &gwsaData) ) return 1;

  // evento 0: fim
  ghServerStopEvent = CreateEvent(
    NULL,    // no security attributes
    TRUE,    // manual reset event
    FALSE,   // not-signalled
    NULL     // no name
  );
  if ( ghServerStopEvent == NULL) {
    return 8;
  }

  return 0;
}

// 0: OK
int iServerSetup(int iMeuPort) // WIN32
{
  struct timeb tstruct;
  WSADATA gwsaData;
  WORD wVersionRequested;
  int iNameLen;

//  _CrtMemState s1;
  _CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);


  // time zone
  tzset();
  ftime(&tstruct);
  giTZ_Delta = tstruct.timezone;

  // setup de TCP/IP
  wVersionRequested = MAKEWORD(1,1);
  if ( WSAStartup(wVersionRequested, &gwsaData) ) return 1;

  // evento 0: fim
  ghServerStopEvent = CreateEvent(
    NULL,    // no security attributes
    TRUE,    // manual reset event
    FALSE,   // not-signalled
    NULL     // no name
  );
  if ( ghServerStopEvent == NULL) {
    return 8;
  }
  hEvents[0] = ghServerStopEvent;

  // evento 1: UDP
  if ( (ghSocketUDP = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) == INVALID_SOCKET ) {
    return 2;
  }
  gstSockInUDP.sin_family      = AF_INET;
  gstSockInUDP.sin_addr.s_addr = htonl(INADDR_ANY);
  gstSockInUDP.sin_port        = htons((u_short)iMeuPort);
  if ( bind(ghSocketUDP, (struct sockaddr *)&gstSockInUDP, sizeof(gstSockInUDP)) == SOCKET_ERROR ) {
    return 3;
  }
  iNameLen = sizeof(gstSockAddrUDP);
  if ( getsockname(ghSocketUDP, &gstSockAddrUDP, &iNameLen) == SOCKET_ERROR ) {
    return 4;
  }
  hUDPSockEvnt = WSACreateEvent();
  if ( WSAEventSelect(ghSocketUDP,hUDPSockEvnt,FD_READ) == SOCKET_ERROR ) {
    return 5;
  }
  hEvents[1] = hUDPSockEvnt;

  // evento 2: stream
  if ( (ghListen = socket(PF_INET, SOCK_STREAM, FALSE)) == INVALID_SOCKET ) {
    return 10;
  }
  gstAddrStream.sin_family      = AF_INET;
  gstAddrStream.sin_port        = htons((USHORT)iMeuPort);
  gstAddrStream.sin_addr.s_addr = INADDR_ANY;
  if ( bind(ghListen, (PSOCKADDR)&gstAddrStream, sizeof(SOCKADDR_IN)) == SOCKET_ERROR ) {
    int iErrNo = WSAGetLastError();
    return 11;
  }
  listen(ghListen, 5);
  hStreamSockEvnt = WSACreateEvent();
  if ( WSAEventSelect(ghListen,hStreamSockEvnt,FD_ACCEPT) == SOCKET_ERROR ) {
    return 12;
  }
  hEvents[2] = hStreamSockEvnt;

  return 0;
}

int iUDP()
{
  struct sockaddr_in stFrom;
  int iFromLen;
  int iBytesRsl;
  u_short iBytes;
  char achBuffer[1024];
  unsigned long ulBytesDisponiveis;
  int iRsl;
  iRsl = ioctlsocket(ghSocketUDP, FIONREAD, &ulBytesDisponiveis);
  if ( ulBytesDisponiveis == 0 )
    return -1;
  if ( ulBytesDisponiveis > sizeof(achBuffer) )
    return -2;
  iFromLen = sizeof(stFrom);
  iBytes = (int)ulBytesDisponiveis;
  iRsl = recvfrom(ghSocketUDP, achBuffer, iBytes, 0, (struct sockaddr *)&stFrom, &iFromLen);
  if ( iRsl == SOCKET_ERROR || iRsl != iBytes )
    return -3;
  iBytesRsl = iProcessUdpMsg(achBuffer, iBytes, NULL);
  if ( iBytesRsl < 1 ) {
        return -4;
  }
  iRsl = sendto(
    ghSocketUDP,
    achBuffer,
    iBytesRsl,
    0,
    (struct sockaddr *)&stFrom,
    iFromLen
  );
  achBuffer[iBytesRsl] = 0;
  return 1;
} // iUDP

BOOL bGetStreamMsg(SOCKET s, WSAEVENT hRcvEvnt, PSTR pszText, int nLength, DWORD dwTimeout)
{
  BOOL bDone = FALSE;
  char c;
  int nIndex = 0;
  int nBytes;
  for ( ;; ) {
    if ( (nBytes = recv(s, &c, sizeof(char), FALSE)) == SOCKET_ERROR ) {
      if ( WSAGetLastError() == WSAEWOULDBLOCK ) {
        DWORD dwRsl = WaitForSingleObject(hRcvEvnt, dwTimeout);
        WSAResetEvent(hRcvEvnt);
        if ( dwRsl != WAIT_OBJECT_0 ) {
          // timeout ou outro erro
          return FALSE;
        }
        continue;
      }
      else {
        return FALSE;
      }
    }
    WSAResetEvent(hRcvEvnt);
    if ( nBytes < 1 ) continue;
    pszText[nIndex++] = c;
    if ( c == 10 ) break;
    if ( nIndex > (nLength-3) ) break;
  }
  pszText[nIndex] = 0;
  return(TRUE);
}

int iStreamMessage(SOCKET hSocketClient, char* achBuf, int iMyPid);

unsigned int _stdcall SessaoStream(PVOID pData)
{
  char szMsg[1024];
  STRUCT_STREAM stStream;
  SOCKET s;
  WSAEVENT hRcvEvnt = NULL;
  memcpy(&stStream, pData, sizeof(STRUCT_STREAM));
  s = stStream.hSocket;
  free(pData);
  hRcvEvnt = WSACreateEvent();
  WSAEventSelect(s, hRcvEvnt, FD_READ);
  if ( strlen(gszCursorPrompt) ) {
   if ( send(s, gszCursorPrompt, strlen(gszCursorPrompt), FALSE) == SOCKET_ERROR ) {
    WSACloseEvent(hRcvEvnt);
    closesocket(s);
    return TRUE;
   }
  }
  giMyPid = _getpid();
  while ( bGetStreamMsg(s, hRcvEvnt, szMsg, sizeof(szMsg), STREAM_TIMEOUT_SECS*1000) != FALSE )  {
    int iRsl;
    if ( (iRsl = iStreamMessage(s, szMsg, giMyPid)) < 0 ) break;
    if ( iRsl == 0 ) continue;
    if ( send(s, szMsg, iRsl, FALSE) == SOCKET_ERROR )
      break;
  }
  WSACloseEvent(hRcvEvnt);
  if ( giSendErrorMessage ) {
    strcpy(szMsg, "*&SOCKET_ERROR\n");
    iStreamMessage(s, szMsg, giMyPid);
  }
  closesocket(s);
  return TRUE;
}

int iStream()
{
  STRUCT_STREAM* pstStream;
  DWORD dwThreadId;
  int iNameLen;
  iNameLen = sizeof(SOCKADDR_IN);
  if ( (ghAccept = accept(
          ghListen,
          (PSOCKADDR)&gstAddrStream,
          &iNameLen
       ) ) == INVALID_SOCKET ) {
    return -1;
  }
  pstStream = (STRUCT_STREAM*)malloc(sizeof(STRUCT_STREAM)+16);
  pstStream->hSocket = ghAccept;

  if ( CreateThread(
         NULL,
         (DWORD)NULL,
         SessaoStream,
         (LPVOID)pstStream,
         (DWORD)NULL,
         &dwThreadId
       ) == NULL ) {
    return -2;
  }
  return 1;
}

int iServerWaitAndHandleEvent() // Win32
{
  int iRsl = 1;
  DWORD dwWait;
  // gstGlobalPrm.ulServerPollDelay est? em milisegundos
  dwWait = WSAWaitForMultipleEvents(3, hEvents, FALSE, gstGlobalPrm.ulServerPollDelay, TRUE);
  switch ( dwWait ) {
    case WSA_WAIT_TIMEOUT:
      iRsl = iProcessTicTac();
      break;
    case WSA_WAIT_EVENT_0+1:  // UDP
      WSAResetEvent(hUDPSockEvnt);
      iRsl = iUDP();
      break;
    case WSA_WAIT_EVENT_0+2:  // stream
      WSAResetEvent(hStreamSockEvnt);
      iRsl = iStream();
      break;
  }
  return iRsl;
}

void vServerShutdown() // Win32
{
  closesocket(ghListen);
  closesocket(ghSocketUDP);
  WSACleanup();
  if ( hUDPSockEvnt )
    WSACloseEvent(hUDPSockEvnt);
}

void vShutdown() // Win32
{
  WSACleanup();
}


//////////////////////////////////////////////////////////////////////////////
//
//  Interface
//

int iOS_SetTime(struct_tm *now) // Win32
{  // linux test :-)
  char szCmd[64];
  sprintf(szCmd, "date %02d%02d%02d%02d%04d.%02d",
    now->tm_mon+1, now->tm_mday,
    now->tm_hour, now->tm_min,
    now->tm_year+1900,
    now->tm_sec
  );
  return 0;
}

void vSleepMillisec(unsigned long ulMillisec) // WIN32
{
  Sleep(ulMillisec);
}

void vOS_Tic(unsigned long ulMillisec) // WIN32
{
  if ( WaitForSingleObject(ghServerStopEvent, ulMillisec) == WAIT_OBJECT_0 )
    gbStop = TRUE;
}

int iOS_CreateStreamSocket() // WIN32
{
  int iRsl;
  iRsl = socket(PF_INET, SOCK_STREAM, 0);
  if ( iRsl < 0 )
    vError("socket");
  return iRsl;
}

int iOS_ConnectStreamSocket(int iPrmSock, char* szIP, int iPort, int iTimeout) // WIN32
{
  int iRsl;
  struct sockaddr_in stAddr;
  u_long ulPrm = 1;
  struct timeval stTimeout;
  u_int iSock = (u_int)iPrmSock;

  if ( ioctlsocket(iSock, FIONBIO, &ulPrm) == SOCKET_ERROR ) {
    vError("ioctlsocket");
    return -7;
  }
  ZeroMemory(&stAddr, sizeof(stAddr));
  if ( (stAddr.sin_addr.S_un.S_addr = inet_addr(szIP)) == INADDR_NONE ) {
    vError("IP");
    return -6;
  }
  stAddr.sin_family = AF_INET;
  stAddr.sin_port   = htons((u_short)iPort);
  iRsl = connect(
    iSock,
    (struct sockaddr *)&stAddr,
    sizeof(stAddr)
  );
  if ( iRsl == SOCKET_ERROR ) {
  }
  FD_ZERO (&active_fd_set);
  FD_SET (iSock, &active_fd_set);
  memset(&stTimeout, 0, sizeof(stTimeout));
  stTimeout.tv_sec = iTimeout;
  stTimeout.tv_usec = 0;  // microseconds

  if ( (iRsl = select(FD_SETSIZE, NULL, &active_fd_set, NULL, &stTimeout)) < 0) {
    return -4;
  }

  if ( FD_ISSET(iSock, &active_fd_set) ) {
    return 0;
  }

  return -1;
}

int iOS_ListenStreamSocket(int iSock, int iPort) // WIN32
{
  struct sockaddr_in stSockInStream;
  struct sockaddr    stSockAddrStream;
  int iNameLenStream;
  int iRsl;
  stSockInStream.sin_family      = AF_INET;
  stSockInStream.sin_addr.s_addr = htonl(INADDR_ANY);
  stSockInStream.sin_port        = htons((u_short)iPort);
  while ( bind(iSock, (struct sockaddr *)&stSockInStream, sizeof(stSockInStream)) < 0 ) {
    vSleepMillisec(5000);
  }
  iNameLenStream = sizeof(stSockAddrStream);
  if ( (iRsl = getsockname(iSock, &stSockAddrStream, &iNameLenStream)) < 0 ) {
    
    return iRsl;
  }
  if ( (iRsl = listen(iSock, 100)) < 0) {
   
    return iRsl;
  }
  return 0;
}

int iOS_WaitConnectStreamSocket(int iPrmSock, int iTimeout) // WIN32
{
  struct timeval stTimeout;
  int iRsl;
  struct sockaddr stSockAddrClient;
  int iNameLenClient;
  u_int iSock = (u_int)iPrmSock;
  FD_ZERO (&listen_fd_set);
  FD_SET (iSock, &listen_fd_set);
  memset(&stTimeout, 0, sizeof(stTimeout));
  stTimeout.tv_sec = iTimeout;
  stTimeout.tv_usec = 0;  // microseconds
  if ( (iRsl = select(FD_SETSIZE, &listen_fd_set, NULL, NULL, &stTimeout)) < 0) {

    return -4;
  }
  if ( FD_ISSET(iSock, &listen_fd_set) ) {
    iNameLenClient = sizeof(stSockAddrClient);
    iRsl = accept(
      iSock,
      (struct sockaddr *)&stSockAddrClient,
      &iNameLenClient
    );
    return iRsl;
  }
  return 0; // timeout
}

// L? at? dar timeout, encher o buffer ou encontrar um iDlm
int iOS_ReadStreamSocketDlm(int iSock, char* achBuf, int iSize, int iTimeout, int iDlm)  // WIN32
{
  char* pTok;
  int iRsl;
  int iBytes = 0;
  time_t lTimeStart;
  time_t lTimeNow;
  int iErrNo;

  time(&lTimeStart);
  while ( iBytes < iSize ) {
    iRsl = recv(
      iSock,
      &achBuf[iBytes],
      iSize - iBytes,
      0
    );
    if ( iRsl == SOCKET_ERROR ) {
      iErrNo = WSAGetLastError();
      if ( iErrNo == WSAEWOULDBLOCK ) {
        time(&lTimeNow);
        if ( (lTimeNow - lTimeStart) > iTimeout )
          return 0;
        vSleepMillisec(100);
        continue;
      }
      return -1;
    }
    if ( (pTok = strchr(achBuf, iDlm)) ) {
      *pTok = 0;
      iBytes = strlen(achBuf);
      break;
    }
    iBytes += iRsl;
    time(&lTimeStart);
  }
  return iBytes;
}

//                                                                  seconds
int iOS_ExtReadStreamSocket(int iSock, char* achBuf, int iSize, int iTimeout) // WIN32
{
  return iOS_ReadStreamSocket(iSock, achBuf, iSize, iTimeout);
}

//                                                               seconds
int iOS_ReadStreamSocket(int iSock, char* achBuf, int iSize, int iTimeout) // WIN32
{
  int iRsl;
  int iBytes = 0;
  int iRetry = 255;
  time_t lTimeStart;
  time_t lTimeNow;
  int iErrNo = 0;
  time(&lTimeStart);
  while ( iBytes < iSize ) {
    iRsl = recv(
      iSock,
      &achBuf[iBytes],
      iSize - iBytes,
      0
    );
    if ( iRsl == SOCKET_ERROR ) {
      iErrNo = WSAGetLastError();
      if ( iErrNo == WSAEWOULDBLOCK && iRetry < 255 ) {
        if ( iRetry == 0 )
          return iBytes;
        iRetry--;
      }
      time(&lTimeNow);
      if ( (lTimeNow - lTimeStart) > iTimeout )
        return 0;
      vSleepMillisec(300);
    }
    else {
      iBytes += iRsl;
      if ( iBytes > 0 &&
           (achBuf[iBytes-1] == '\r' || achBuf[iBytes-1] == '\n') )
        return iBytes;
      iRetry = 1;
      vSleepMillisec(300);
    }
  }
  return iBytes;
}

int iOS_WriteStreamSocket(int iSock, char* achBuf, int iSize) // WIN32
{
  int iRsl = 0;
  int iRetry;
  int iLeft;
  iLeft = iSize;
  vSleepMillisec(200);
  for ( iRetry = 5;  iRetry && iLeft;  iRetry-- ) {
    iRsl = send(
      iSock,
      &achBuf[iSize-iLeft],
      iLeft,
      0
    );
    if ( iRsl == SOCKET_ERROR ) {
      if ( errno == WSAEWOULDBLOCK ) {
        vSleepMillisec(1000);
        continue;
      }
      break;
    }
    iLeft -= iRsl;
  }
  return iRsl;
}

int iOS_CloseStreamSocket(int iSock) // WIN32
{
  closesocket(iSock);
  return 0;
}

int iOS_CreateUdpSocket(int iPort)  // WIN32
{
  int iSocket;
  if ( (iSocket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) == INVALID_SOCKET )
    return INVALID_SOCKET;
  return iSocket;
}

int iOS_GetUdpMsg(int hSocketUDP, char *pszMsg, int iPrmBytes, void* pFrom, int* piFrom)  // WIN32
{
  return 0;
}

int iOS_SendUdpMsg(int hSocketUDP, char *pszMsg, int iPrmBytes, void* pFrom, int iFrom)  // WIN32
{
  return 0;
}

int iOS_UdpQuery(char* szIP, int iPort, char* szCmd, char* szRsl, int iRslLen, long lTimeout)  // WIN32
{
  u_int hSocketUDP;
  struct sockaddr_in stSockInUDP;
  time_t lStart;
  time_t lNow;
#if 1
  fd_set active_fd_set, read_fd_set;
  struct timeval stTimeout;
#endif
  struct linger stLinger;
  int iRsl;
  int iBytes;
  struct sockaddr_in stFrom;
  int iFromLen;
  if ( (hSocketUDP = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) == INVALID_SOCKET ) {
    vError("socket UDP");
    return -1;
  }

  ZeroMemory(&stSockInUDP, sizeof(stSockInUDP));
  if ( (stSockInUDP.sin_addr.S_un.S_addr = inet_addr(szIP)) == INADDR_NONE ) {
    vError("IP");
    return -6;
  }
  stSockInUDP.sin_family = AF_INET;
  stSockInUDP.sin_port   = htons((u_short)iPort);

  memset(&stLinger, 0 , sizeof(stLinger));
  stLinger.l_onoff = 1;
  stLinger.l_linger = 30;

  iRsl = sendto(hSocketUDP, szCmd, strlen(szCmd), 0, (const struct sockaddr*)&stSockInUDP, sizeof(stSockInUDP));
  if ( iRsl < 0 ) {
    vError("sendto");
    return -5;
  }
  time(&lStart);
  lNow = lStart;
  FD_ZERO(&active_fd_set);
  FD_SET(hSocketUDP, &active_fd_set);
  memset(&stTimeout, 0, sizeof(stTimeout));
  stTimeout.tv_sec = lTimeout;
  stTimeout.tv_usec = 0;  // microseconds

  while ( 1 ) {
    read_fd_set = active_fd_set;
    if ( (iRsl = select(FD_SETSIZE, &read_fd_set, NULL, NULL, &stTimeout)) < 0 ) {
      if ( errno == EINTR )
        vTrace("interrupted select");
      else
        vError ("select");

      return -6;
    }
    if ( iRsl == 0 )
      return 0;

    iFromLen = sizeof(struct sockaddr);
    iBytes = recvfrom(hSocketUDP, szRsl, iRslLen-1, 0, (struct sockaddr *)&stFrom, &iFromLen);
    if ( iBytes == SOCKET_ERROR ) {
      int iError = WSAGetLastError();
      if ( iError == WSAECONNRESET ) {
        vSleepMillisec(300);
        continue;
      }
    }
    if ( iBytes >= 0 ) {
      szRsl[iBytes] = 0;
      break;
    }
  }
  closesocket(hSocketUDP);
  return iBytes;
}

int iOS_ResetSockets() // Win32
{
  return 0;
}

int iOS_SetNetStatus(int ii) // Win32
{
  return 0;
}

int iOS_GetNetStatus() // Win32
{
  return 0;
}

int iOS_GetPid() // Win32
{
  return _getpid();
}

int iOS_StopProcess(int pid, int iShutdownTimeout)  // Win32
{
  return 1;
}

int iOS_Process(char* szCmd) // Win32
{
  return 1;
}

int iOS_ExternalCommand(char* szCmd) // Win32
{
  system(szCmd);
  return 1;
}

int iOS_ExternalCommandExt(char* szCmd, int* piExitStatus, char* szPrmRsl, unsigned int uRslBytes) // Win32
{
  FILE* pf;
  char szLineRsl[256];
  char* pWrk;

  *piExitStatus = 120;
  *szPrmRsl = 0;
  pWrk = (char*)malloc(strlen(szCmd)+256);
  if ( pWrk == NULL )
    return -11;
  sprintf(pWrk, "%s", szCmd);
  
  if ( (pf = popen(pWrk, "r")) == NULL ) {
    free(pWrk);
    return -10;
  }
  memset(szLineRsl, 0, sizeof(szLineRsl));
  while ( fgets(szLineRsl, sizeof(szLineRsl), pf) ) {
    if ( (strlen(szPrmRsl) + strlen(szLineRsl) + 4) >= uRslBytes) {
      continue;
    }
    strcat(szPrmRsl, szLineRsl);
  }
  pclose(pf);
  free(pWrk);
  *piExitStatus = atoi(szLineRsl); // isto est? errado, deveria procurar "Everything is OK" ou algo assim

  return 0;
}

int hOS_LockFile(char* szFile) // Win32 -- lock n?o funciona: teste de presen?a
{
  struct stat stStat;
  int hLock;
  if ( stat(szFile, &stStat) != 0 ) {
    if ( (hLock = open(szFile, _O_RDWR | _O_CREAT, _S_IREAD | _S_IWRITE)) < 0 ) {

      return -3;
    }
    write(hLock, "LOCK", 4);
    close(hLock);
  }
  if ( (hLock = open(szFile, _O_RDWR)) < 0 ) {
   
    return -2;
  }
  return hLock;
}

int bOS_UnlockFile(int hLock)
{
  close(hLock);
  return TRUE;
}

int hOS_ExtraLockDir(char* szDir, char* szLockName)  // Win32
{
  return 1;
}

int bOS_ExtraUnlockDir(int hExtraLock)  // Win32
{
  return TRUE;
}

// -1: not found
// -2: found, but unable to allocate memory
// >= 0, found, open, allocated and loaded
long lFile2MemExt(STRUCT_FILE2MEM_EXT* pstPrm)  // Win32
{
  char* psz;
  long lBytes;
  if ( (pstPrm->pf = fopen(pstPrm->szPath, "rb+")) == NULL ) return -1;
  fseek(pstPrm->pf, 0, SEEK_END);
  lBytes = ftell(pstPrm->pf);
  if ( (psz = (char*)malloc(lBytes + 256)) == NULL ) {
    fclose(pstPrm->pf);
    pstPrm->pf = NULL;
    return -1;
  }
  fseek(pstPrm->pf, 0, SEEK_SET);
  fread(psz, 1, lBytes, pstPrm->pf);
  psz[lBytes] = 0;
  pstPrm->lBytes = lBytes;
  pstPrm->pszData = psz;
  return lBytes;
} // lFile2MemExt

// >= 0, ok
//
// Substitui tanto o conte?do do arquivo quanto os dados em pstPrm
// por ach, lBytes
//
long lFile2MemExtReplace(STRUCT_FILE2MEM_EXT* pstPrm, long lBytes, char* ach)  // Win32
{
  long lRsl;
  char* achTmp;
  if ( (achTmp = (char*)malloc(lBytes + 16)) == NULL ) return -1;
  if ( pstPrm->pszData != NULL ) free(pstPrm->pszData);
  pstPrm->pszData = achTmp;
  pstPrm->lBytes = lBytes;
  memcpy(pstPrm->pszData, ach, lBytes);
  fseek(pstPrm->pf, 0, SEEK_SET);
  lRsl = fwrite(ach, 1, lBytes, pstPrm->pf);
  return lRsl;
} // lFile2MemExtReplace

void vFile2MemExtClose(STRUCT_FILE2MEM_EXT* pstPrm)  // Win32
{
  if ( pstPrm->pszData != NULL ) {
    free(pstPrm->pszData);
    pstPrm->pszData = NULL;
  }
  if ( pstPrm->pf != NULL ) {
    fclose(pstPrm->pf);
    pstPrm->pf = NULL;
  }
} // vFile2MemExtClose

long lOS_AvailableDiskKB(char* szPath)  // Win32
{
  return 2097153;
} // lOS_AvailableDiskKB

// < 0: erro
// 0: n?o fez
// 1: fez
int iOS_DoBackupDB(char* szPrmPrefix, char* szPrmFileList, int iPrmMax)  // Win32
{
  char szCmd[512];
  char szLine[512];
  char achRsl[4096];
  FILE* pf;
  time_t lTime;
  struct tm *now;
  int iTotalBytes = 0;
  long lLeftKB;
  if ( (lLeftKB = lOS_AvailableDiskKB("../BACKUP")) < 1000000 ) {
    
  }
  time(&lTime);
  now = localtime(&lTime);
  sprintf(szCmd, "tar cvfz ../BACKUP/%s_%04d%02d%02d%02d%02d%02d.tar.gz %s",
    szPrmPrefix,
    now->tm_year+1900, now->tm_mon+1, now->tm_mday,
    now->tm_hour, now->tm_min, now->tm_sec,
    szPrmFileList
  );
  if ( (pf = popen(szCmd, "r")) == NULL )
    return -10;
  memset(achRsl, 0, sizeof(achRsl));
  memset(szLine, 0, sizeof(szLine));
  while ( fgets(szLine, sizeof(szLine)-1, pf) ) {
    if ( (strlen(szLine) + strlen(achRsl) + 4) >= sizeof(achRsl) ) {
      continue;
    }
    strcat(achRsl, szLine);
  }
  pclose(pf);
  return 1;
} // iOS_DoBackupDB

int iOS_Fork() // Win32
{
  return -1;
}


int iWaitAndHandleEvent()
{
  return  1;
}

void vShutdown()
{
}

void vServerShutdown()
{
  close(hSocketUDP);
  close(hSocketStream);
  if ( iFinishChildren() )
    iWait4Children();
}


void vTraceSocketMsgWithPid(char* szFormat, char* achBuf)
{
  char szWrk[1024];
  sprintf(szWrk, "%5d %s", (int)giMyPid, szFormat);
  vTraceSocketMsg(szWrk, achBuf);
}


int bOS_ExtraUnlockDir(int hExtraLock)
{
  struct flock stLock;
  memset(&stLock, 0, sizeof(stLock));
  stLock.l_type = F_UNLCK;
  if ( fcntl(hExtraLock, F_SETLK, &stLock) == -1 ) {
  }
  close(hExtraLock);
  return TRUE;
}

// forward -- external callbacks
int iStreamMessage(SOCKET hSocketClient, char* achBuf, int iMyPid);

int iStreamSession()
{
  int iBytes = 0;
  char achBuf[65530];
  fd_set active_fd_set, read_fd_set;
  struct linger stLinger;
  struct sockaddr_in addrPeer;
  size_t iAddrLen = sizeof(struct sockaddr);

  // set gszIP
  if ( getpeername(hSocketClient, (struct sockaddr*)&addrPeer, (socklen_t *) &iAddrLen) ) {
    switch ( errno ) {
    case EBADF:     vError("getpeername EBADF");       break;
    case ENOTSOCK:  vError("getpeername ENOTSOCK");    break;
    case ENOTCONN:  vError("getpeername ENOTCONN");    break;
    case ENOBUFS:   vError("getpeername ENOBUFS");     break;
    default:        vError("getpeername other");       break;
    }
    strcpy(gszIP, "ERR");
  }
  else {
    strcpy(gszIP, inet_ntoa(addrPeer.sin_addr));
  }

  if ( gpszArgv0 != NULL ) {
    char szDbg[256+_MAX_PATH];
    int iLen;
    sprintf(szDbg, "s-%s", gszIP);
    if ( (iLen = strlen(szDbg)) <= strlen(gpszArgv0) ) {
      iReplaceString(gpszArgv0, szDbg);
    }
    else if ( iLen > 4 ) {
      iLen = iLen - 2;
      sprintf(szDbg, "s-%*.*s", iLen, iLen, gszIP);
    }
    else {
      iReplaceString(gpszArgv0, "specstr");
    }
    vTraceSetPid(iOS_GetPid());
  }

  giMyPid = getpid();
  gszVersion[0] = 0;

  memset(&stLinger, 0 , sizeof(stLinger));
  stLinger.l_onoff = 0;
  stLinger.l_linger = 0;
  if ( setsockopt(hSocketClient, SOL_SOCKET, SO_LINGER, &stLinger, sizeof(stLinger)) < 0) {
    vError("setsockopt Client");
  }
  if ( sigaction(SIGCHLD, NULL, NULL) < 0 ) {
    vError("action child in child");
  }
  if ( sigaction(SIGQUIT, NULL, NULL) < 0 ) {
    vError("action quit in child");
  }
  if ( sigaction(SIGTERM, NULL, NULL) < 0 ) {
    vError("action term in child");
  }

  FD_ZERO(&active_fd_set);
  FD_SET(hSocketClient, &active_fd_set);

  // Signal handlers
  memset(&stSigChild, 0, sizeof(stSigChild));
  stSigChild.sa_handler = pChild;
  if ( sigaction(SIGCHLD, &stSigChild, NULL) < 0 ) {
    vError ("action child");
  }
  memset(&stSigQUIT, 0, sizeof(stSigQUIT));
  stSigQUIT.sa_handler = pQUIT;
  if ( sigaction(SIGQUIT, &stSigQUIT, NULL) < 0 ) {
    vError ("action quit");
  }
  memset(&stSigTERM, 0, sizeof(stSigTERM));
  stSigTERM.sa_handler = pTERM;
  if ( sigaction(SIGTERM, &stSigTERM, NULL) < 0 ) {
    vError ("action term");
  }

  while ( gbStop == FALSE ) {
    int iRsl;
    struct timeval stTimeout;
    read_fd_set = active_fd_set;
    memset(&stTimeout, 0, sizeof(stTimeout));
#ifdef HENRY
    stTimeout.tv_sec = 3600;
#else
    stTimeout.tv_sec = 10;
#endif
    stTimeout.tv_usec = 0;  // microseconds
    if ( (iRsl = select(FD_SETSIZE, &read_fd_set, NULL, NULL, &stTimeout)) < 0 ) {
     
    }
    else {
      if ( ! FD_ISSET(hSocketClient, &read_fd_set) ) {

        break;
      }
     
      iBytes = recv(hSocketClient, achBuf, sizeof(achBuf), 0);
#ifdef HENRY
      {
        char szMsg[20480];
        char chASCII[2];
        int ii = 0;
        memset(szMsg, 0, sizeof(szMsg));
        while ( ii != iBytes ){
          sprintf(chASCII,"%c", achBuf[ii]);
          strcat(szMsg, chASCII);
          ii++;
        }
        sprintf(achBuf,szMsg);
      }
#endif
      if ( iBytes == 0 ) {
        break;
      }
    }
    achBuf[iBytes] = 0;
  
    iRsl = iStreamMessage(hSocketClient, achBuf, giMyPid);
    if ( iRsl < 0 ) break;
    if ( iRsl > 0 ) {
      send(hSocketClient, achBuf, iRsl, 0);
    }
  }
  close(hSocketClient);
  return 0;
}

int iUDPMsg()
{
  int iBytes;
  int iRsl = 0;
  char achBuf[4096];
  char szPeerIP[32];
  struct sockaddr_in stFrom;
  socklen_t iFromLen;
  iBytes = recvfrom(hSocketUDP, achBuf, sizeof(achBuf), 0, (struct sockaddr *)&stFrom, &iFromLen);
  if ( iBytes < 0 ) {
    vError("recvfrom");
    return 0;
  }
  strcpy(szPeerIP, inet_ntoa(stFrom.sin_addr));
  if ( !strcmp(szPeerIP, "0.0.0.0") )
    return 0;
  iBytes = iProcessUdpMsg(achBuf, iBytes, szPeerIP);
  if ( iBytes > 0 )
    iRsl = sendto(hSocketUDP, achBuf, iBytes, 0, (struct sockaddr *)&stFrom, iFromLen);
  if ( iRsl < 0 )
    vError("sendto");
  return 1;
}


int iOS_SockTest(char *szPrmIP)
{
  int gsockExcribo = 0;
  char szCmd[2048];
  char achBuf[2048];
  char szIP[32];
  int iRsl;
  strcpy(szIP, szPrmIP);
  printf("Crea(T)e; (C)onnect; (W)rite; (R)ead; C(l)ose; (Q)uit ?\n");
  fgets(szCmd, sizeof(szCmd), stdin);
  while ( szCmd[0] != 'Q' && szCmd[0] != 'q' ) {
    switch ( szCmd[0] ) {
    case 'T':
    case 't':
      iRsl = iOS_CreateStreamSocket();
      printf("Rsl=%d\n", iRsl);
      if ( iRsl >= 0 )
        gsockExcribo = iRsl;
      break;
    case 'C':
    case 'c':
      strtok(szCmd, "\r\n");
      if ( strlen(szCmd) > 1 ) {
        strcpy(szIP, &szCmd[1]);
      }
      iRsl = iOS_ConnectStreamSocket(gsockExcribo, szIP, 8602, 5);
      printf("Rsl=%d\n", iRsl);
      break;
    case 'R':
    case 'r':
      iRsl = iOS_ReadStreamSocket(gsockExcribo, achBuf, sizeof(achBuf), 2);
      if ( iRsl > 0 && iRsl < sizeof(achBuf) ) {
        achBuf[iRsl] = 0;
        printf("Rsl=%d [%s]\n", iRsl, achBuf);
      }
      else {
        printf("Rsl=%d\n", iRsl);
      }
      break;
    case 'W':
    case 'w':
      iRsl = iOS_WriteStreamSocket(gsockExcribo, &szCmd[1], strlen(&szCmd[1]));
      printf("Rsl=%d\n", iRsl);
      break;
    case 'L':
    case 'l':
      iRsl = iOS_CloseStreamSocket(gsockExcribo);
      printf("Rsl=%d\n", iRsl);
      break;
    }
    printf("---\nCrea(T)e; (C)onnect; (W)rite; (R)ead; C(l)ose; (Q)uit ?\n");
    fgets(szCmd, sizeof(szCmd), stdin);
  }
  return 0;
}

int iOS_UdpCmd(int hUDP_Socket, char *pszMsg, int iPrmBytes)
{
  char szMsg[256];
  int iRsl;
  if ( (iRsl = iOS_GetUdpMsg(hUDP_Socket, szMsg, sizeof(szMsg), gachUDP_ControlFrom, &giUDP_ControlFrom)) <= 0 )
    return iRsl;
  if ( iRsl >= iPrmBytes ) {
    iRsl = iPrmBytes - 1;
  }
  memcpy(pszMsg, szMsg, iRsl);
  pszMsg[iRsl] = 0;
  return TRUE;
}

void vTraceSocketMsg(char* szMsg, char* szCmd)
{
  char szDbg[2048];
  char szMyCmd[1024];
  char* pch;
  int iLen;
  int bNL = FALSE;
  strncpy(szMyCmd, szCmd, sizeof(szMyCmd)-2);
  szMyCmd[sizeof(szMyCmd)-2] = 0;
  iLen = strlen(szMyCmd);
  while ( iLen > 0 && (szMyCmd[iLen-1] == '\r' || szMyCmd[iLen-1] == '\n') ) {
    szMyCmd[--iLen] = 0;
    bNL = TRUE;
  }
  szMyCmd[70] = 0;
  for ( pch = szMyCmd;  *pch;  pch++ )
    if ( *pch < ' ' || *pch > '~') *pch = '.';
  if ( iLen > 59 ) {
    char szWrk[32];
    sprintf(szWrk, " ... (%d bytes)", iLen);
    strcat(szMyCmd, szWrk);
  }
  sprintf(szDbg, szMsg, szMyCmd, bNL);
  vTrace(szDbg);
}


int iOS_GetSockName(SOCKET iSocket, char* szIP)
{
  int iRsl;
  struct sockaddr_in stSockAddr;
  unsigned int iNameLen;
  iNameLen = sizeof(stSockAddr);
  if ( (iRsl = getsockname(iSocket, (struct sockaddr*)&stSockAddr, &iNameLen)) < 0 ) {
    szIP[0] = 0;
    return iRsl;
  }
  strcpy(szIP, inet_ntoa(stSockAddr.sin_addr));
  return 0;
}

int iGetActiveLock(char* szName)
{
  char szTitle[_MAX_PATH];
  sprintf(szTitle, "%s/%s.lck",
    gstGlobalPrm.szWrkDir,
    szName
  );
  return hOS_LockFile(szTitle);
}

void vCheckVenditorPid()
{
  static int iVenditorPid = -1;
  char szLine[32];
  FILE* pf;
  char szTitle[_MAX_PATH];
  sprintf(szTitle, "%s/venditor.pid",
    gstGlobalPrm.szWrkDir
  );
  if ( (pf = fopen(szTitle, "r")) == NULL ) return;
  if ( fgets(szLine, sizeof(szLine), pf) ) {
    int iReadPid = atoi(szLine);
    if ( iVenditorPid < 0 ) {
      iVenditorPid = iReadPid;
    }
    else {
      if ( iReadPid != iVenditorPid ) {
        gbStop = TRUE;
      
      }
    }
  }
  fclose(pf);
}

// 0: OK
int iWriteMyPid(char* szWrkDir, char* szName)
{
  FILE* pf;
  char szTitle[_MAX_PATH];
  sprintf(szTitle, "%s/%s",
    szWrkDir,
    szName
  );
  if ( (pf = fopen(szTitle, "w")) == NULL ) return -1;
  fprintf(pf, "%d\n", iOS_GetPid());
  fclose(pf);
  return 0;
} // iWriteMyPid

int iRemoveMyPid(char* szWrkDir, char* szName)
{
  FILE* pf;
  char szTitle[_MAX_PATH];
  sprintf(szTitle, "%s/%s",
    szWrkDir,
    szName
  );
  if ( (pf = fopen(szTitle, "r")) == NULL ) return -1;
  iDIR_Remove(szTitle);
  return 0;
} // iRemoveMyPid

//////////////////////////////////////////////////////////////////////////////
//
//  zip / unzip
//

void change_file_date(
    const char *filename,
    uLong dosdate,
    tm_unz tmu_date )
{
  HANDLE hFile;
  FILETIME ftm,ftLocal,ftCreate,ftLastAcc,ftLastWrite;
  hFile = CreateFileA(filename,GENERIC_READ | GENERIC_WRITE,0,NULL,OPEN_EXISTING,0,NULL);
  GetFileTime(hFile,&ftCreate,&ftLastAcc,&ftLastWrite);
  DosDateTimeToFileTime((WORD)(dosdate>>16),(WORD)dosdate,&ftLocal);
  LocalFileTimeToFileTime(&ftLocal,&ftm);
  SetFileTime(hFile,&ftm,&ftLastAcc,&ftm);
  CloseHandle(hFile);

uLong filetime(f, tmzip, dt)
    char *f;                /* name of file to get info on */
    tm_zip *tmzip;             /* return value: access, modific. and creation times */
    uLong *dt;             /* dostime */
    {
    int ret = 0;
    {
        FILETIME ftLocal;
        HANDLE hFind;
        WIN32_FIND_DATAA ff32;

        hFind = FindFirstFileA(f,&ff32);
        if (hFind != INVALID_HANDLE_VALUE)
        {
            FileTimeToLocalFileTime(&(ff32.ftLastWriteTime),&ftLocal);
            FileTimeToDosDateTime(&ftLocal,((LPWORD)dt)+1,((LPWORD)dt)+0);
            FindClose(hFind);
            ret = 1;
        }
    }
    return ret;
    }
}

