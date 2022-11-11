#ifndef UTIL_H_INCLUDED
#define UTIL_H_INCLUDED


char* pStrCpy(char *pDst, int iBytesDst, char* pOrg, const char* pDlms);
char* pSkpDlm(char* pOrg, char* pDlms);
int iGetNextSquare(int iMvType,int iMyRange, int iOrRow, int iOrCol, int iDestRow, int iDestCol, char*szLayer);


#endif				// UTIL_H_INCLUDED
