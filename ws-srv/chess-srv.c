#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <stdint.h>
#include <stdint.h>
#include <sys/socket.h>

#include "wsserver/ws.h"
#include "chess.h"
#include "wssv.h"
#include "util.h"

int iMoveMatrix[8][8];
char *pszGetNextSquare(int iMvType,int iMyRange, int iOrRow, int iOrCol, int iDestRow, int iDestCol, char *pch);

typedef struct STRUCT_CHESSDATA{
    int iPieceType;
    int iMoveType;
    int iCol;
    int iRow;
    int iX;
    int iY;
}STRUCT_CHESSDATA;


int bMatchMovementDirection(int iPcMvType, int iMvType){
    return (iPcMvType & iMvType);
}

int iProcessLayer(char *pszLayer){
    return 0;
}


int iParseMessage(char *pszMsg, int iSz, ws_cli_conn_t *client){
    char *pTok;
    char szFld[128];
    char szLayer[1024];
    char szRet[2048];
    int iMvType, iMyRange, iOrRow, iOrCol, iDestRow, iDestCol;
    if ( iSz <= 0 ){
        ws_sendframe_txt(client, "ERR|CMDNTSPP");
        return -1;
    }
    if ( !memcmp(pszMsg, "BYE", 3) ){
      return 0;
    }


    pTok = pSkpDlm(pszMsg, " \t\n");
    pTok = pStrCpy(szFld, sizeof(szFld), pTok, "|");
    iMvType = atoi(szFld);
    pTok = pSkpDlm(pTok, " \t|");
    pTok = pStrCpy(szFld, sizeof(szFld), pTok, "|");
    iMyRange = atoi(szFld);
    pTok = pSkpDlm(pTok, " \t|");
    pTok = pStrCpy(szFld, sizeof(szFld), pTok, "|");
    iOrRow = atoi(szFld);
    pTok = pSkpDlm(pTok, " \t|");
    pTok = pStrCpy(szFld, sizeof(szFld), pTok, "|");
    iOrCol = atoi(szFld);
    pTok = pSkpDlm(pTok, " \t|");
    pTok = pStrCpy(szFld, sizeof(szFld), pTok, "|");
    iDestRow = atoi(szFld);
    pTok = pSkpDlm(pTok, " \t|");
    pTok = pStrCpy(szFld, sizeof(szFld), pTok, "|");
    iDestCol = atoi(szFld);
    memset(szFld, 0, sizeof(szFld));
    memset(szLayer, 0, sizeof(szLayer));
    pTok = pSkpDlm(pTok, " \t|");
    pTok = pStrCpy(szLayer, sizeof(szLayer), pTok, "|");


    iGetNextSquare(iMvType, iMyRange,  iOrRow,  iOrCol,  iDestRow,  iDestCol, szLayer);

    iProcessLayer(szLayer);

    /* Retorno protocolo */
    memset(szRet, 0, sizeof(szRet));
    sprintf(szRet, "OK|%s", szLayer);
    ws_sendframe_txt(client,szRet);

    return 0;
}
int iGetNextSquare(int iMvType,int iMyRange, int iOrRow, int iOrCol, int iDestRow, int iDestCol, char *szLayer){
    int i,j;
    char szActualRowCol[1024];
    int iOffsetRow = ((iDestRow - iOrRow) >= 0) ? 1 : -1;
    int iOffsetCol = ((iDestCol - iOrCol) >= 0) ? 1 : -1;

    memset(szActualRowCol, 0, sizeof(szActualRowCol));
    if ( bMatchMovementDirection(iMvType, (int)MOVEMENT_DIRECTION_COLUMN ) ){
        for ( i = iOrRow ; i <= iDestRow; ){
            char szWrk[32];
            i += iOffsetRow;
            memset(szWrk, 0, sizeof(szWrk));
            sprintf(szWrk, "%d,%d;", iOrRow+i, iOrCol);
            strcat(szActualRowCol, szWrk);
            if ( (i-iOrRow) > iMyRange ){
                iMvType = iMvType ^MOVEMENT_DIRECTION_COLUMN;
                break;
            }
        }
    }

    if ( bMatchMovementDirection(iMvType, (int)MOVEMENT_DIRECTION_LINE ) ){
        for ( j = iOrCol ; j <= iDestCol; ){
            char szWrk[32];
            j+= iOffsetCol;
            memset(szWrk, 0, sizeof(szWrk));
            sprintf(szWrk, "%d,%d;", iOrRow, iOrCol+j);
            strcat(szActualRowCol, szWrk);
            if ( (j-iOrCol) > iMyRange ){
                iMvType = iMvType ^MOVEMENT_DIRECTION_LINE;
                break;
            }
        }
    }

    if  ( bMatchMovementDirection(iMvType, (int)MOVEMENT_DIRECTION_DIAGONAL )
          && (bMatchMovementDirection(iMvType, SUBTYPE_DIAG_ALL) == 0) ){
        for ( i = iOrRow ; i <= iDestRow; ){
            for ( j = iOrCol ; j <= iDestCol; ){
                char szWrk[32];
                i+= iOffsetRow;
                j+= iOffsetCol;
                memset(szWrk, 0, sizeof(szWrk));
                sprintf(szWrk, "%d,%d;", iOrRow+i, iOrCol+j);
                strcat(szActualRowCol, szWrk);
                if ( (j-iOrCol) > iMyRange && (i-iOrRow) > iMyRange ){
                    iMvType = iMvType ^ MOVEMENT_DIRECTION_DIAGONAL;
                    break;
                }
            }
        }
    }

    if (szActualRowCol[0] == 0 ){
      return -1;
    }

    return 0;
}

int main(int argc, char *argv[])
{
    struct ws_events evs;

    evs.onopen    = &onopen;
    evs.onclose   = &onclose;
    evs.onmessage = &onmessage;

    ws_socket(&evs, 8080, 0, 1000); /* Never returns. */
    return 0;
}
