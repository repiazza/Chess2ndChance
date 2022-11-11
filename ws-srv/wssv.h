#ifndef WSSV_H_INCLUDED
#define WSSV_H_INCLUDED


void onmessage(ws_cli_conn_t *client, const unsigned char *msg, uint64_t size, int type);
void onclose(ws_cli_conn_t *client);
void onopen(ws_cli_conn_t *client);

#endif				// WSSV_H_INCLUDED
