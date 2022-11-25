#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <stdint.h>
#include <stdint.h>
#include <sys/socket.h>
#include <wsserver/ws.h>
#include "chess-srv.h"
#include "chess.h"
#include "wssv.h"
#include "util.h"
#include "trace.h"

int iMoveMatrix[8][8];
char *pszGetNextSquare(
    int iMvType,
    int iMyRange, 
    int iOrRow, 
    int iOrCol, 
    int iDestRow, 
    int iDestCol, 
    char *pch
);

typedef struct STRUCT_CHESSDATA{
    int iPieceType;
    int iMoveType;
    int iCol;
    int iRow;
    int iX;
    int iY;
} 
STRUCT_CHESSDATA;



int bMatchMovementDirection(int iPcMvType, int iMvType){
    return (iPcMvType & iMvType);
}

int iProcessLayer(char *pszLayer){
    return 0;
}

// info depth 1 seldepth 1 multipv 1 score cp 30 nodes 20 nps 20000 tbhits 0 time 1 pv e2e4
// info depth 2 seldepth 2 multipv 1 score cp 84 nodes 45 nps 45000 tbhits 0 time 1 pv e2e4 a7a6
// info depth 3 seldepth 3 multipv 1 score cp 37 nodes 191 nps 95500 tbhits 0 time 2 pv c2c4 a7a6 e2e4
// info depth 4 seldepth 4 multipv 1 score cp 158 nodes 264 nps 132000 tbhits 0 time 2 pv c2c4
// info depth 5 seldepth 6 multipv 1 score cp 49 nodes 1449 nps 483000 tbhits 0 time 3 pv e2e4 d7d5 e4d5 d8d5 d2d4
// info depth 6 seldepth 6 multipv 1 score cp 36 nodes 3954 nps 790800 tbhits 0 time 5 pv e2e4 c7c5 c2c3 b8c6
// info depth 7 seldepth 9 multipv 1 score cp 37 nodes 6269 nps 626900 tbhits 0 time 10 pv e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 g8f6
// info depth 8 seldepth 12 multipv 1 score cp 30 nodes 11049 nps 649941 tbhits 0 time 17 pv e2e4 e7e5 g1f3 b8c6 d2d4 e5d4 f3d4 g8f6 d4c6 b7c6
// info depth 9 seldepth 13 multipv 1 score cp 30 nodes 15347 nps 697590 tbhits 0 time 22 pv e2e4 e7e6 d2d4 d7d5 b1d2 g8f6 e4e5 f6d7 c2c3 c7c5 g1f3
// info depth 10 seldepth 14 multipv 1 score cp 37 nodes 23259 nps 775300 tbhits 0 time 30 pv e2e4 c7c5 g1f3 d7d6 f1b5 c8d7 b5d7 d8d7 e1g1
// info depth 11 seldepth 14 multipv 1 score cp 45 nodes 40064 nps 589176 tbhits 0 time 68 pv e2e4 c7c5 g1f3 e7e6 g2g3 d7d6 d2d4 c5d4 f3d4 g8f6
// info depth 12 seldepth 15 multipv 1 score cp 38 nodes 57767 nps 534879 tbhits 0 time 108 pv e2e4 c7c5 g1f3 b8c6 f1b5 c6d4 b5e2 e7e6 f3d4 c5d4 e1g1 a7a6
// info depth 13 seldepth 15 multipv 1 score cp 46 nodes 97551 nps 510738 tbhits 0 time 191 pv d2d4 d7d5 g1f3 g8f6 c2c4 e7e6 g2g3 f8e7 f1g2 e8g8 e1g1 d5c4 b1d2
// info depth 14 seldepth 20 multipv 1 score cp 38 nodes 152736 nps 495896 tbhits 0 time 308 pv d2d4 d7d5 g1f3 g8f6 c2c4 c7c6 b1c3 g7g6 e2e3 f8g7 f1e2 e8g8 e1g1 d5c4 e2c4
// info depth 15 seldepth 17 multipv 1 score cp 43 nodes 214622 nps 528625 tbhits 0 time 406 pv e2e4 c7c5 g1f3 d7d6 f1b5 c8d7 b5d7 b8d7 e1g1 g7g6 f1e1 g8f6 c2c3 f8g7 d2d4 c5d4
// info depth 16 seldepth 23 multipv 1 score cp 39 nodes 484091 nps 638642 tbhits 0 time 758 pv d2d4 d7d5 g1f3 e7e6 c2c4 a7a6 c4d5 e6d5 g2g3 g8f6 f1g2 c7c6 b1c3 f8e7 e1g1 e8g8 d1c2 f8e8
// info depth 17 seldepth 24 multipv 1 score cp 42 nodes 570807 nps 640636 tbhits 0 time 891 pv d2d4 d7d5 g1f3 e7e6 c2c4 g8f6 g2g3 f8e7 f1g2 e8g8 e1g1 d5c4 f3e5 b8c6 g2c6 b7c6 e5c6 d8e8 c6e7 e8e7
// info depth 18 seldepth 24 multipv 1 score cp 51 nodes 873460 nps 675007 hashfull 388 tbhits 0 time 1294 pv d2d4 d7d5 c2c4 e7e6 g1f3 g8f6 g2g3 f8b4 c1d2 c7c5 f1g2 d5c4 d2b4 c5b4 d1c1 c8d7 c1c4 d8b6 b1d2 e8g8 a1c1 b8c6
// info depth 19 seldepth 28 multipv 1 score cp 36 nodes 1119774 nps 684458 hashfull 478 tbhits 0 time 1636 pv d2d4 d7d5 c2c4 e7e6 g1f3 d5c4 e2e4 b7b5 a2a4 c7c6 a4b5 c6b5 b2b3 g8f6 b3c4 b5c4 f1c4 f6e4 e1g1 f8e7 d4d5 e8g8 d5e6 c8e6 c4e6
// info depth 20 seldepth 30 multipv 1 score cp 47 nodes 1494341 nps 701239 hashfull 594 tbhits 0 time 2131 pv d2d4 d7d5 c2c4 e7e6 b1c3 f8b4 c4d5 e6d5 g1f3 g8f6 c1g5 h7h6 g5f6 d8f6 d1b3 c7c5 e2e3 b8c6 d4c5 e8g8 f1d3
// info depth 21 seldepth 29 multipv 1 score cp 44 nodes 2170638 nps 724753 hashfull 747 tbhits 0 time 2995 pv d2d4 d7d5 g1f3 g8f6 c2c4 d5c4 e2e3 e7e6 f1c4 c7c5 e1g1 a7a6 d4c5 d8d1 f1d1 f8c5 b1c3 b8d7 c4e2 b7b5
// info depth 22 seldepth 30 multipv 1 score cp 51 lowerbound nodes 2354287 nps 723061 hashfull 785 tbhits 0 time 3256 pv d2d4

char gszNextMoveLines[5096];
int iGetNextMoveLines(char *szActualPositionChain, int iMode){
    FILE *pfStockFish;
    FILE *pfInput;
    char szCmd[256];
    char szLine[1024];
    char *pszTitle = "input.txt";

    vTrace("iGetNextMoveLines begin");

    if ( bStrIsEmpty(szActualPositionChain) )
        return -1;

    vTraceStr("iGetNextMoveLines actual position chain:", szActualPositionChain);

    if ( (pfInput = fopen(pszTitle, "w")) == NULL )
        return -1;
    
    fprintf(pfInput, 
  "uci\n"
  "ucinewgame\n"
  "position %s %s\n"
  "go depth 10\n"
  "ucinewgame\n"
  "quit\n",
        iMode == MODE_FEN ? "fen" : "startpos moves",
        szActualPositionChain
    );
    fclose(pfInput);

    sprintf(szCmd, 
"cat %s | stockfish | cut -d \" \" -f20,21,23,24,25,26,27,28,29,30,31,32",
      pszTitle);

    if ( (pfStockFish = popen(szCmd, "r")) == NULL )
        return -1;

    vTrace("OK");
    memset(gszNextMoveLines,0, sizeof(gszNextMoveLines));
    memset(szLine,0, sizeof(szLine));
    while ( fgets(szLine, sizeof(szLine), pfStockFish ) ){
        vTraceStr("Line ", szLine);
        vTrace("\n");
        if ( !bStrIsEmpty(szLine) && strstr(szLine, "uciok") == NULL ){
            strcat(gszNextMoveLines, szLine);
            strcat(gszNextMoveLines, "|");
        }
        memset(szLine, 0, sizeof(szLine));
    }
    
    pclose(pfStockFish);
    
    return 0;
}

int iParseMessage(char *pszMsg, int iSz, ws_cli_conn_t *client){
    char *pTok;
    char szFld[128];
    char szLayer[1024];
    char szRet[2048];
    int iMvType, iMyRange, iOrRow, iOrCol, iDestRow, iDestCol;
    
    vTrace("iParseMessage Begin");
    if ( iSz <= 0 ){
        ws_sendframe_txt(client, "ERR|CMDNTSPP");
        return -1;
    }
    if ( !memcmp(pszMsg, "BYE", 3) ){
      return 0;
    }
    if ( !memcmp(pszMsg, "STK", 3) ){
      char *pszCurrPos;
      char szMode[16];

      vTraceStr("iParseMessage received msg:", pszMsg);
      pTok = strchr(pszMsg, '|'); pTok++;
      pStrCpy(szMode, sizeof(szMode), pTok, "|");
      pTok = strchr(pTok, '|'); pTok++;
      vTraceStr("pTok=", pTok);
      pszCurrPos = (char *) malloc(strlen(pTok) + 8);
      pStrCpy(pszCurrPos, strlen(pTok), pTok, "|");
      if ( iGetNextMoveLines(pszCurrPos, MODE_FEN) < 0 )
        return -1;
      
      free(pszCurrPos);
      vTraceStr("iParseMessage lines:", gszNextMoveLines);
      ws_sendframe_txt(client, gszNextMoveLines);
      
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
