import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

interface SwitchVSCodeSettings {
	vaultPath: string;
}

export default class SwitchVSCode extends Plugin {
	settings: SwitchVSCodeSettings;

	async onload() {
		this.addSettingTab(new SwitchVSCodeSettingsTab(this.app, this));
		await this.loadSettings();
		this.addCommand({
			id: "Switch-vscode",
			name: "Switch current file with Visual Studio Code",
			callback: this.SwitchCurrentFile.bind(this),
		});
	}

	// open file in vscode
	async SwitchCurrentFile() {
		const vaultPath = this.settings.vaultPath;
		const currentFilePath = this.app.workspace.getActiveFile().path;
		if (vaultPath)
			console.error("please config vault path in plugin setting");
		currentFilePath
			? window.open(`vscode://file/${vaultPath}/${currentFilePath}`)
			: console.error("no editor available yet");
	}

	async loadSettings() {
		this.settings = Object.assign({}, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SwitchVSCodeSettingsTab extends PluginSettingTab {
	plugin: SwitchVSCode;

	constructor(app: App, plugin: SwitchVSCode) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Settings" });

		new Setting(containerEl).setName("vault path").addText((text) =>
			text
				.setValue(this.plugin.settings.vaultPath)
				.onChange(async (value) => {
					value = value.trim();
					this.plugin.settings.vaultPath = value;
					await this.plugin.saveSettings();
				})
		);
	}
}
