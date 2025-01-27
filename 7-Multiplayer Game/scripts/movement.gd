extends CharacterBody2D

const SPEED = 18000.0
var begin = 0

func _enter_tree() -> void:
	set_multiplayer_authority(name.to_int())
	global_position = Vector2(250,250)

func _physics_process(delta: float) -> void:
	#560 330
	begin += delta
	if begin > 5:
		var x = global_position.x
		var y = global_position.y
		if (x > 560 or x < 0) or (y > 330 or y < 0):
			print("DEAD")
			var zero = 0
			var crash = 1/zero
			self.queue_free()
		
	if !is_multiplayer_authority():
		return
	var dx := Input.get_axis("ui_left", "ui_right")
	var dy := Input.get_axis("ui_up", "ui_down")
	velocity.x = dx * SPEED * delta
	velocity.y = dy * SPEED * delta
	
	move_and_slide()
	
	var bombing = Input.is_action_just_pressed("ui_accept")
	if bombing:
		get_tree().get_root().get_node("Node2D").rpc("spawn_bomb", global_position)
