#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <wsserver/ws.h>
#include "wsserver/ws.h"

int iParseMessage(char *pszMsg, int iSz, ws_cli_conn_t *client);

void onclose(ws_cli_conn_t *client)
{
}
void onopen(ws_cli_conn_t *client)
{
}
void onmessage(ws_cli_conn_t *client, const unsigned char *msg, uint64_t size, int type)
{
    char *pTok;

    pTok = (char *) malloc(size + 8);
    sprintf(pTok, "%s", msg);
    iParseMessage(pTok, size+8, client);
    free(pTok);

}
