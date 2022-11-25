# Makefile for ws-srv 

############################ Linux
ifdef LINUX

  CCOPT =
  LDOPT =
  ADDON_LIBS = -lpthread -l:libws.a

  CC     = gcc

  ifdef   DEBUG
    CCOPT += -O2 -Wall -g -DLINUX -DDEBUG=$(DEBUG)
    LDOPT += -g
  else
    CCOPT += -O2 -Wall -DLINUX
  endif

  LIBS= $(ADDON_LIBS)

  CHESS-SRVEXEC=chess-srv

  ifdef CFLAGS
    CCOPT += $(CFLAGS)
  endif

endif
############################ end Linux

OBJS += \
  chess-srv.o \
  util.o \
  wssv.o \
  trace.o \


chess-srv: $(OBJS)
	$(CC) $(LDOPT) -o $(CHESS-SRVEXEC) $(OBJS) $(LIBDIR) $(LIBS)

all: clean $(CHESS-SRVEXEC)

fake: $(CHESS-SRVEXEC)

clean:
	rm -f $(OBJS) $(CHESS-SRVEXEC)



%.o: %.c
	$(CC) -c $(CCOPT) $< -o $@

########################################################### Dependencias


# DO NOT DELETE THIS LINE -- make depend depends on it.
