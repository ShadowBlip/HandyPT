extends Plugin
const qam_scene := preload("res://plugins/handypt/core/powertools_menu.tscn")
const qam_icon := preload("res://plugins/handypt/assets/powertools_icon.png")

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	add_to_qam.call_deferred(qam_scene.instantiate(), qam_icon)
