extends VBoxContainer

const powertools_path : String = "/etc/handypt/powertools"

@onready var cpu_boost_button := $CPUBoostButton
@onready var gpu_freq_enable := $GPUFreqEnableButton
@onready var gpu_freq_max_slider := $GPUFreqMaxSlider
@onready var gpu_freq_max_value_label := $GPUFreqMaxLabelContainer/GPUFreqMaxValueLabel
@onready var gpu_freq_min_slider := $GPUFreqMinSlider
@onready var gpu_freq_min_value_label := $GPUFreqMinLabelContainer/GPUFreqMinValueLabel
@onready var smt_button := $SMTButton
@onready var tdp_boost_slider := $TDPBoostSlider
@onready var tdp_boost_value_label := $TDPBoostLabelContainer/TDPBoostValueLabel
@onready var tdp_slider := $TDPSlider
@onready var tdp_value_label := $TDPLabelContainer/TDPValueLabel

# Called when the node enters the scene tree for the first time.
func _ready():
	# Find defaults and current settings.
	if read_sys("/sys/devices/system/cpu/cpufreq/boost") == "1":
		cpu_boost_button.button_pressed = true
	if read_sys("/sys/class/drm/card0/device/power_dpm_force_performance_level") == "manual":
		gpu_freq_enable.button_pressed = true
		gpu_freq_max_slider.editable = true
		gpu_freq_min_slider.editable = true
	if read_sys("/sys/devices/system/cpu/smt/control") == "on":
		smt_button.button_pressed = true

	# Connect Signals
	cpu_boost_button.toggled.connect(_on_toggle_cpu_boost)
	gpu_freq_enable.toggled.connect(_on_toggle_gpu_freq)
	gpu_freq_max_slider.value_changed.connect(_on_max_gpu_freq_changed)
	gpu_freq_min_slider.value_changed.connect(_on_min_gpu_freq_changed)
	smt_button.toggled.connect(_on_toggle_smt)
	tdp_boost_slider.value_changed.connect(_on_tdp_boost_value_changed)
	tdp_slider.value_changed.connect(_on_tdp_value_changed)

	# Set up UI with current values
	gpu_freq_max_value_label.text = str(gpu_freq_max_slider.value)
	gpu_freq_min_value_label.text = str(gpu_freq_min_slider.value)
	tdp_boost_value_label.text = str(tdp_boost_slider.value)
	tdp_value_label.text = str(tdp_slider.value)
	
	# Set write mode for power_dpm_force_performance_level
	var output = []
	var exit_code := OS.execute(powertools_path, ["pdfpl", "write"], output)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func read_sys(path: String) -> String:
	var output = []
	var exit_code := OS.execute("cat", [path], output)
	return output[0].strip_escapes()


func _on_get_current_apu_settings() -> bool:
	var output = []
	var exit_code := OS.execute(powertools_path, ["ryzenadj", "-i"], output)
	if exit_code:
		return false
	return true	

func _on_max_gpu_freq_changed(value: float):
	if value < gpu_freq_min_slider.value:
		gpu_freq_min_slider.value = value
	var output = []
	var args = ["gpuclk", "1", str(value)]
	var exit_code := OS.execute(powertools_path, args, output)
	gpu_freq_max_value_label.text = str(value)


func _on_min_gpu_freq_changed(value: float):
	if value > gpu_freq_max_slider.value:
		gpu_freq_max_slider.value = value
	var output = []
	var args = ["gpuclk", "0", str(value)]
	var exit_code := OS.execute(powertools_path, args, output)
	gpu_freq_min_value_label.text = str(value)


func _on_tdp_boost_value_changed(value: float):
	var slowPPT: float = (floor(value/2) + tdp_slider.value) * 1000
	var fastPPT: float = (value + tdp_slider.value) * 1000
	var output = []
	var exit_code := OS.execute(powertools_path, ["ryzenadj", "-c", str(fastPPT)], output)
	exit_code = OS.execute(powertools_path, ["ryzenadj", "-a", str(slowPPT)], output)
	tdp_boost_value_label.text = str(value)


func _on_tdp_value_changed(value: float):
	var output = []
	var exit_code := OS.execute(powertools_path, ["ryzenadj", "-b", str(value + 1000)], output)
	_on_tdp_boost_value_changed(tdp_boost_slider.value)
	tdp_value_label.text = str(value)


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
