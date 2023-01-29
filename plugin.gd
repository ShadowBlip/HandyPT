extends Plugin
const qam_scene := preload("res://plugins/handypt/core/powertools_menu.tscn")
const qam_icon := preload("res://plugins/handypt/assets/powertools_icon.svg")



# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	var unpacked_scene = qam_scene.instantiate()
	focus_node = unpacked_scene.focus_node
	add_to_qam.call_deferred(unpacked_scene, qam_icon)
