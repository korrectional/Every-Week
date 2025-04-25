format PE64 GUI 4.0
entry start

include 'C:\Users\satar\Downloads\fasmw17332\INCLUDE\win64a.inc'

section '.text' code readable executable
start:
    sub rsp,8
    mov rcx,0
    mov rdx,msg
    mov r8,cap
    mov r9,0x40
    call [MessageBoxW]
    mov ecx,eax
    call [ExitProcess]

section '.data' data readable writeable
msg du 0x30D0,0x30AB,0   ; バカ
cap du 0x5C0F,0          ; 小

section '.idata' import data readable writeable
    library user32,'USER32.DLL',kernel32,'KERNEL32.DLL'
    import user32,MessageBoxW,'MessageBoxW'
    import kernel32,ExitProcess,'ExitProcess'