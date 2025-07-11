const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  shell,
  dialog,
} = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

// App metadata
const APP_INFO = {
  name: "Uber Boost for Drivers",
  version: "1.0.0",
  description: "Fortune Teller for Surge Pricing - by Eliv8",
  author: "Eliv8 Technologies",
  website: "https://eliv8.com",
  copyright: "© 2024 Eliv8 Technologies. All rights reserved.",
};

class UberBoostApp {
  constructor() {
    this.mainWindow = null;
    this.splashWindow = null;
  }

  async initialize() {
    // Set app metadata
    app.setName(APP_INFO.name);
    app.setVersion(APP_INFO.version);

    // App event listeners
    app.whenReady().then(() => this.createSplashScreen());
    app.on("window-all-closed", this.handleWindowsClosed);
    app.on("activate", this.handleActivate);
    app.on("web-contents-created", this.handleWebContentsCreated);

    // Security: Prevent navigation to external URLs
    app.on("web-contents-created", (event, contents) => {
      contents.on("will-navigate", (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);

        if (parsedUrl.origin !== "http://localhost:3000" && !isDev) {
          event.preventDefault();
        }
      });
    });

    // Handle deep links (for notifications, etc.)
    app.setAsDefaultProtocolClient("uberboost");
  }

  createSplashScreen() {
    this.splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      alwaysOnTop: true,
      transparent: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    this.splashWindow.loadFile(path.join(__dirname, "assets", "splash.html"));

    // Create main window after splash
    setTimeout(() => {
      this.createMainWindow();
      this.splashWindow.close();
    }, 3000);
  }

  createMainWindow() {
    // Main application window
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      show: false,
      icon: path.join(__dirname, "assets", "icon.png"),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "preload.js"),
        webSecurity: true,
      },
      titleBarStyle: "default",
    });

    // Load the app
    const startUrl = isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/spa/index.html")}`;

    this.mainWindow.loadURL(startUrl);

    // Show window when ready
    this.mainWindow.once("ready-to-show", () => {
      this.mainWindow.show();

      // Focus on the window
      if (isDev) {
        this.mainWindow.webContents.openDevTools();
      }
    });

    // Handle window closed
    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });

    // Create application menu
    this.createMenu();

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "deny" };
    });
  }

  createMenu() {
    const template = [
      {
        label: "File",
        submenu: [
          {
            label: "Export Ride Data",
            accelerator: "CmdOrCtrl+E",
            click: () => this.exportRideData(),
          },
          {
            label: "Import Ride Data",
            accelerator: "CmdOrCtrl+I",
            click: () => this.importRideData(),
          },
          { type: "separator" },
          {
            label: "Settings",
            accelerator: "CmdOrCtrl+,",
            click: () => this.openSettings(),
          },
          { type: "separator" },
          {
            role: "quit",
            accelerator: "CmdOrCtrl+Q",
          },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "selectall" },
        ],
      },
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
          { type: "separator" },
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          { type: "separator" },
          { role: "togglefullscreen" },
        ],
      },
      {
        label: "Navigation",
        submenu: [
          {
            label: "Dashboard",
            accelerator: "CmdOrCtrl+1",
            click: () => this.navigateTo("/"),
          },
          {
            label: "Surge Navigation",
            accelerator: "CmdOrCtrl+2",
            click: () => this.navigateTo("/surge-navigation"),
          },
          {
            label: "Ride Logger",
            accelerator: "CmdOrCtrl+3",
            click: () => this.navigateTo("/ride-logger"),
          },
          {
            label: "Analytics",
            accelerator: "CmdOrCtrl+4",
            click: () => this.navigateTo("/analytics"),
          },
          {
            label: "Find Gas Stations",
            accelerator: "CmdOrCtrl+5",
            click: () => this.navigateTo("/gas-stations"),
          },
        ],
      },
      {
        label: "Window",
        submenu: [
          { role: "minimize" },
          { role: "close" },
          ...(process.platform === "darwin"
            ? [
                { type: "separator" },
                { role: "front" },
                { type: "separator" },
                { role: "window" },
              ]
            : []),
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "About Uber Boost",
            click: () => this.showAbout(),
          },
          {
            label: "User Guide",
            click: () =>
              shell.openExternal("https://eliv8.com/uber-boost/help"),
          },
          {
            label: "Contact Support",
            click: () =>
              shell.openExternal(
                "mailto:support@eliv8.com?subject=Uber Boost Support",
              ),
          },
          { type: "separator" },
          {
            label: "Check for Updates",
            click: () => this.checkForUpdates(),
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  // Menu action handlers
  async exportRideData() {
    const result = await dialog.showSaveDialog(this.mainWindow, {
      title: "Export Ride Data",
      defaultPath: `uber-boost-rides-${new Date().toISOString().split("T")[0]}.csv`,
      filters: [
        { name: "CSV Files", extensions: ["csv"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!result.canceled) {
      // Send message to renderer to trigger export
      this.mainWindow.webContents.send("export-ride-data", result.filePath);
    }
  }

  async importRideData() {
    const result = await dialog.showOpenDialog(this.mainWindow, {
      title: "Import Ride Data",
      properties: ["openFile"],
      filters: [
        { name: "CSV Files", extensions: ["csv"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      // Send message to renderer to trigger import
      this.mainWindow.webContents.send("import-ride-data", result.filePaths[0]);
    }
  }

  openSettings() {
    this.navigateTo("/settings");
  }

  navigateTo(route) {
    this.mainWindow.webContents.send("navigate", route);
  }

  showAbout() {
    dialog.showMessageBox(this.mainWindow, {
      type: "info",
      title: "About Uber Boost",
      message: APP_INFO.name,
      detail: `${APP_INFO.description}\n\nVersion: ${APP_INFO.version}\n${APP_INFO.copyright}\n\nFor more information, visit ${APP_INFO.website}`,
      buttons: ["OK"],
    });
  }

  async checkForUpdates() {
    // In production, implement auto-updater
    dialog.showMessageBox(this.mainWindow, {
      type: "info",
      title: "Check for Updates",
      message: "You're running the latest version!",
      detail: `Current version: ${APP_INFO.version}`,
      buttons: ["OK"],
    });
  }

  // App event handlers
  handleWindowsClosed = () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  };

  handleActivate = () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createMainWindow();
    }
  };

  handleWebContentsCreated = (event, contents) => {
    // Security: Prevent new window creation
    contents.on("new-window", (event, navigationUrl) => {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    });
  };
}

// Initialize the app
const uberBoostApp = new UberBoostApp();
uberBoostApp.initialize();

// IPC handlers for renderer communication
ipcMain.handle("get-app-version", () => APP_INFO.version);
ipcMain.handle("get-app-info", () => APP_INFO);

module.exports = { UberBoostApp, APP_INFO };
