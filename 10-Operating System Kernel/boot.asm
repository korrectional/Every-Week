org 0x7c00


mov ax, 0
mov es, ax
mov ds, ax

mov ah, 2
mov al, 1
mov ch, 0
mov cl, 2
mov dh, 0
mov bx, 0x7e00
int 0x13


mov ah, 0x0e
mov al, [0x7E00]
int 0x10


diskOne:
	times 2 db 'A'

times 510-($-$$) db 0
dw 0xaa55

diskTwo:
	times 512 db 'A'