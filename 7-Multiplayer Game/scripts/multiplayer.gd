extends Node2D

var peer = ENetMultiplayerPeer.new()
@onready var ui: CanvasLayer = $UI
@export var player_scene: PackedScene
@export var bomb_scene: PackedScene  # Export bomb scene
@onready var join_link: TextEdit = $UI/join/TextEdit
const BOMB = preload("res://scene/bomb.tscn")

func _on_host_pressed() -> void:
	
	peer.create_server(3000)
	multiplayer.multiplayer_peer = peer
	multiplayer.peer_connected.connect(_add_player)
	_add_player()  # Add the host as a player
	ui.visible = false

func _on_join_pressed() -> void:
	peer.create_client(join_link.text, 3000)
	multiplayer.multiplayer_peer = peer
	ui.visible = false

func _add_player(id = 1) -> void:
	var player = player_scene.instantiate()
	player.name = str(id)
	call_deferred("add_child", player)
	player.global_position = Vector2(255,255)
	
	
	
@rpc("any_peer")
func spawn_bomb(global_position: Vector2):
	if not BOMB:
		print("Bomb scene is not configured!")
		return
	var bomb = BOMB.instantiate()
	add_child(bomb)
	bomb.global_position = global_position
