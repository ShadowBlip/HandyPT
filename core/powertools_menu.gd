extends VBoxContainer

@onready var smt_button := $SMTButton

# Called when the node enters the scene tree for the first time.
func _ready():
	smt_button.toggled.connect(_on_toggle_smt)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_toggle_smt(state: bool):
	var args := ["smt", "off"]
	if state:
		args = ["smt", "on"]
	print("Toggle SMT ", args[0], args[1])
	var result := OS.execute("/home/blip/git/github/ShadowBlip/HandyPT/etc/handypt/powertools", args)
	print(result)
