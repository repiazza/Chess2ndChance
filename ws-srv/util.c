#include <string.h>
#include "util.h"


char* pStrCpy(char *pDst, int iBytesDst, char* pOrg, const char* pDlms)
{
  if ( iBytesDst < 1 )
    iBytesDst = 32000;
  for ( iBytesDst--;  *pOrg && strchr(pDlms, *pOrg) == NULL && iBytesDst;  pOrg++, pDst++, iBytesDst-- )
    *pDst = *pOrg;
  *pDst = 0;
  return pOrg;
}

char* pSkpDlm(char* pOrg, char* pDlms)
{
  for ( ;  *pOrg && strchr(pDlms, *pOrg) != NULL;  pOrg++ );
  return pOrg;
}
int bStrIsEmpty(const char *sz)
{
  if ( sz == NULL )
    return TRUE;
  for ( ;  *sz;  sz++ ) {
    if ( strchr(" \n\r\t", *sz) == NULL )
      return FALSE;
  }
  return TRUE;
}
