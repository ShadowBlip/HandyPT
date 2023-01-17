extends VBoxContainer

const powertools_path : String = "/home/blip/git/github/ShadowBlip/HandyPT/etc/handypt/powertools"

@onready var cpu_boost_button := $CPUBoostButton
@onready var gpu_freq_enable := $GPUFreqEnableButton
@onready var gpu_freq_max_slider := $GPUFreqMaxSlider
@onready var gpu_freq_min_slider := $GPUFreqMinSlider
@onready var smt_button := $SMTButton
@onready var tdp_boost_slider := $TDPBoostSlider
@onready var tdp_slider := $TDPSlider


# Called when the node enters the scene tree for the first time.
func _ready():
	if read_sys("/sys/devices/system/cpu/cpufreq/boost") == "1":
		cpu_boost_button.button_pressed = true
	if read_sys("/sys/class/drm/card0/device/power_dpm_force_performance_level") == "manual":
		gpu_freq_enable.button_pressed = true
		gpu_freq_max_slider.editable = true
		gpu_freq_min_slider.editable = true
	if read_sys("/sys/devices/system/cpu/smt/control") == "on":
		smt_button.button_pressed = true
	
	cpu_boost_button.toggled.connect(_on_toggle_cpu_boost)
	gpu_freq_enable.toggled.connect(_on_toggle_gpu_freq)
	gpu_freq_max_slider.value_changed.connect(_on_max_gpu_freq_changed)
	gpu_freq_min_slider.value_changed.connect(_on_min_gpu_freq_changed)
	smt_button.toggled.connect(_on_toggle_smt)
	tdp_boost_slider.value_changed.connect(_on_tdp_boost_value_changed)
	tdp_slider.value_changed.connect(_on_tdp_value_changed)
	
	
	# Set write mode for power_dpm_force_performance_level
	var output = []
	var exit_code := OS.execute(powertools_path, ["pdfpl", "write"], output)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func read_sys(path: String) -> String:
	print("Attempting to read " + path)
	var output = []
	var exit_code := OS.execute("cat", [path], output)
	print(output[0].strip_escapes())
	return output[0].strip_escapes()


func _on_max_gpu_freq_changed(value: float):
	if value < gpu_freq_min_slider.value:
		gpu_freq_min_slider.value = value
	print("gpu_max")


func _on_min_gpu_freq_changed(value: float):
	if value > gpu_freq_max_slider.value:
		gpu_freq_max_slider.value = value
	print("gpu_min")
	var output = []
	var args = ["gpuclk", "0", str(value)]
	var exit_code := OS.execute(powertools_path, args, output)


func _on_tdp_boost_value_changed(value: float):
	var slowPPT: float = floor(value/2) + tdp_slider.value
	var fastPPT: float = value + tdp_slider.value
	var output = []
	var exit_code := OS.execute(powertools_path, ["ryzenadj", "-c", str(fastPPT)], output)
	exit_code = OS.execute(powertools_path, ["ryzenadj", "-a", str(slowPPT)], output)


func _on_tdp_value_changed(value: float):
	var output = []
	var exit_code := OS.execute(powertools_path, ["ryzenadj", "-b", str(value)], output)
	_on_tdp_boost_value_changed(tdp_boost_slider.value)


func _on_toggle_cpu_boost(state: bool):
	var args := ["cpuBoost", "0"]
	if state:
		args = ["cpuBoost", "1"]
	var output = []
	var exit_code := OS.execute(powertools_path, args, output)


func _on_toggle_gpu_freq(state: bool):
	var output = []
	if state:
		var exit_code := OS.execute(powertools_path, ["pdfpl", "manual"], output)
		gpu_freq_max_slider.editable = true
		gpu_freq_min_slider.editable = true
		return
	var exit_code := OS.execute(powertools_path, ["pdfpl", "auto"], output)
	gpu_freq_max_slider.editable = false
	gpu_freq_min_slider.editable = false


func _on_toggle_smt(state: bool):
	var args := ["smt", "off"]
	if state:
		args = ["smt", "on"]
	var output = []
	var exit_code := OS.execute(powertools_path, args, output)



