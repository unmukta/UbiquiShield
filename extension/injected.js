(() => {

  const spoofSeed = Math.random();
  const spoofFloat = (spoofSeed - 0.5) * 0.0001;

  // Native Hook Masking
  const originalToString = Function.prototype.toString;
  const hookedFunctions = new WeakSet();

  Function.prototype.toString = function(...args) {
    if (hookedFunctions.has(this)) {
      const funcName = this.name || '';
      return `function ${funcName}() { [native code] }`;
    }
    if (this === Function.prototype.toString) {
      return `function toString() { [native code] }`;
    }
    return originalToString.apply(this, args);
  };

  // Hardware Concurrency
  Object.defineProperty(
    Navigator.prototype,
    "hardwareConcurrency",
    {
      get() {
        return 8;
      },
      configurable: true
    }
  );

  // Device Memory
  Object.defineProperty(
    Navigator.prototype,
    "deviceMemory",
    {
      get() {
        return 8;
      },
      configurable: true
    }
  );

  // Language Spoofing
  Object.defineProperty(
    Navigator.prototype,
    "language",
    {
      get() {
        return "en-US";
      },
      configurable: true
    }
  );

  Object.defineProperty(
    Navigator.prototype,
    "languages",
    {
      get() {
        return ["en-US", "en"];
      },
      configurable: true
    }
  );

  // Plugins Spoofing
  Object.defineProperty(
    Navigator.prototype,
    "plugins",
    {
      get() {
        return [
          { name: "Chrome PDF Plugin", filename: "internal-pdf-viewer", description: "Portable Document Format" },
          { name: "Chrome PDF Viewer", filename: "mhjimiapi", description: "" },
          { name: "Native Client", filename: "internal-nacl-plugin", description: "" }
        ];
      },
      configurable: true
    }
  );

  // MimeTypes Spoofing
  Object.defineProperty(
    Navigator.prototype,
    "mimeTypes",
    {
      get() {
        return [
          { type: "application/pdf", suffixes: "pdf", description: "" }
        ];
      },
      configurable: true
    }
  );

  // Client Hints Spoofing
  if (navigator.userAgentData) {
    Object.defineProperty(Navigator.prototype, 'userAgentData', {
      get() {
        return {
          brands: [
            {brand: "Chromium", version: "120"},
            {brand: "Google Chrome", version: "120"},
            {brand: "Not=A?Brand", version: "24"}
          ],
          mobile: false,
          platform: "Windows",
          getHighEntropyValues: function(hints) {
            return Promise.resolve({
              architecture: "x86",
              bitness: "64",
              brands: this.brands,
              mobile: false,
              model: "",
              platform: "Windows",
              platformVersion: "10.0.0",
              uaFullVersion: "120.0.6099.109",
              fullVersionList: this.brands
            });
          }
        };
      },
      configurable: true
    });
  }

  // Battery API Spoofing
  if (navigator.getBattery) {
    const originalGetBattery = navigator.getBattery;
    navigator.getBattery = function() {
      return Promise.resolve({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1.0,
        onchargingchange: null,
        onchargingtimechange: null,
        ondischargingtimechange: null,
        onlevelchange: null
      });
    };
    hookedFunctions.add(navigator.getBattery);
  }

  // Timezone
  const originalResolvedOptions =
    Intl.DateTimeFormat.prototype.resolvedOptions;

  const OriginalDateTimeFormat = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function(...args) {
    const options = args[1] || {};
    options.timeZone = "UTC";
    args[1] = options;
    return new OriginalDateTimeFormat(...args);
  };
  Intl.DateTimeFormat.prototype = OriginalDateTimeFormat.prototype;


  Date.prototype.getTimezoneOffset = function() {
    return 0;
  };

  Intl.DateTimeFormat.prototype.resolvedOptions =
    function() {

      const result =
        originalResolvedOptions.call(this);

      result.timeZone =
        "UTC";

      return result;
    };

  // Canvas Fingerprinting Protection
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  const contextTypes = new WeakMap();

  HTMLCanvasElement.prototype.getContext = function(contextId, ...args) {
    const ctx = originalGetContext.apply(this, [contextId, ...args]);
    if (ctx && !contextTypes.has(this)) {
      contextTypes.set(this, contextId);
    }
    return ctx;
  };

  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;

  HTMLCanvasElement.prototype.toDataURL = function(...args) {
    const type = contextTypes.get(this);
    if (type === "2d") {
      try {
        const ctx = originalGetContext.call(this, "2d");
        if (ctx) {
          ctx.save();
          ctx.fillStyle = "rgba(1,1,1,0.01)";
          ctx.fillRect(0, 0, 1, 1);
          ctx.restore();
        }
      } catch {
        // Safe fail
      }
    }
    return originalToDataURL.apply(this, args);
  };

  const originalToBlob = HTMLCanvasElement.prototype.toBlob;

  HTMLCanvasElement.prototype.toBlob = function(...args) {
    const type = contextTypes.get(this);
    if (type === "2d") {
      try {
        const ctx = originalGetContext.call(this, "2d");
        if (ctx) {
          ctx.save();
          ctx.fillStyle = "rgba(1,1,1,0.01)";
          ctx.fillRect(0, 0, 1, 1);
          ctx.restore();
        }
      } catch {
        // Safe fail
      }
    }
    return originalToBlob.apply(this, args);
  };

  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

  CanvasRenderingContext2D.prototype.getImageData = function(...args) {
    const imageData = originalGetImageData.apply(this, args);
    if (imageData && imageData.data && imageData.data.length > 0) {
      const idx = Math.floor(spoofSeed * imageData.data.length);
      imageData.data[idx] = (imageData.data[idx] + 1) % 256;
    }
    return imageData;
  };

  if (window.WebGLRenderingContext) {
    const originalReadPixels = WebGLRenderingContext.prototype.readPixels;
    WebGLRenderingContext.prototype.readPixels = function(...args) {
      originalReadPixels.apply(this, args);
      const pixels = args[6];
      if (pixels && pixels.length > 0) {
        const idx = Math.floor(spoofSeed * pixels.length);
        pixels[idx] = (pixels[idx] + 1) % 256;
      }
    };
  }

  if (window.WebGL2RenderingContext) {
    const originalReadPixels2 = WebGL2RenderingContext.prototype.readPixels;
    WebGL2RenderingContext.prototype.readPixels = function(...args) {
      originalReadPixels2.apply(this, args);
      const pixels = args[6];
      if (pixels && pixels.length > 0) {
        const idx = Math.floor(spoofSeed * pixels.length);
        pixels[idx] = (pixels[idx] + 1) % 256;
      }
    };
  }

  // WebGL Parameter Spoofing
  if (window.WebGLRenderingContext) {
    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) return "Google Inc. (Apple)"; // UNMASKED_VENDOR_WEBGL
      if (parameter === 37446) return "ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)"; // UNMASKED_RENDERER_WEBGL
      return originalGetParameter.apply(this, arguments);
    };
    hookedFunctions.add(WebGLRenderingContext.prototype.getParameter);
  }

  if (typeof WebGL2RenderingContext !== "undefined") {
    const originalGetParameter2 = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) return "Google Inc. (Apple)";
      if (parameter === 37446) return "ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)";
      return originalGetParameter2.apply(this, arguments);
    };
    hookedFunctions.add(WebGL2RenderingContext.prototype.getParameter);
  }

  // Audio Fingerprinting Protection
  if (
    window.AudioBuffer &&
    AudioBuffer.prototype.getChannelData
  ) {

    var originalGetChannelData =
      AudioBuffer.prototype.getChannelData;

    AudioBuffer.prototype.getChannelData =
      function() {

        const results =
          originalGetChannelData.apply(
            this,
            arguments
          );

        if (results.length > 0) {
          const idx = Math.floor(spoofSeed * results.length);
          results[idx] = results[idx] + 0.0000001;
        }

        return results;

      };

  }

  if (window.AnalyserNode) {
    var originalGetFloatFrequencyData = AnalyserNode.prototype.getFloatFrequencyData;
    AnalyserNode.prototype.getFloatFrequencyData = function(array) {
      originalGetFloatFrequencyData.call(this, array);
      if (array.length > 0) {
        const idx = Math.floor(spoofSeed * array.length);
        array[idx] = array[idx] + 0.1;
      }
    };
    
    var originalGetByteFrequencyData = AnalyserNode.prototype.getByteFrequencyData;
    AnalyserNode.prototype.getByteFrequencyData = function(array) {
      originalGetByteFrequencyData.call(this, array);
      if (array.length > 0) {
        const idx = Math.floor(spoofSeed * array.length);
        array[idx] = (array[idx] + 1) % 256;
      }
    };
  }

  // WebGL
  const originalGetExtension =
    WebGLRenderingContext.prototype.getExtension;

  WebGLRenderingContext.prototype.getExtension =
    function(name) {

      if (
        name ===
        "WEBGL_debug_renderer_info"
      ) {
        return null;
      }

      return originalGetExtension.call(
        this,
        name
      );

    };

  const originalGetParameter =
    WebGLRenderingContext.prototype.getParameter;

  WebGLRenderingContext.prototype.getParameter =
    function(parameter) {

      if (parameter === 37445)
        return "Google Inc.";

      if (parameter === 37446)
        return "ANGLE (Generic GPU)";

      if (parameter === 3379)
        return 4096;

      if (parameter === 34024)
        return 4096;

      if (parameter === 7936)
        return "WebKit";

      if (parameter === 7937)
        return "WebGL";

      return originalGetParameter.call(
        this,
        parameter
      );

    };

  // WebGL2
  if (
    typeof WebGL2RenderingContext !==
    "undefined"
  ) {

    var originalGetExtension2 =
      WebGL2RenderingContext.prototype
        .getExtension;

    WebGL2RenderingContext.prototype
      .getExtension =
      function(name) {

        if (
          name ===
          "WEBGL_debug_renderer_info"
        ) {
          return null;
        }

        return originalGetExtension2
          .call(this, name);

      };

    var originalGetParameter2 =
      WebGL2RenderingContext.prototype
        .getParameter;

    WebGL2RenderingContext.prototype
      .getParameter =
      function(parameter) {

        if (parameter === 37445)
          return "Google Inc.";

        if (parameter === 37446)
          return "ANGLE (Generic GPU)";

        if (parameter === 3379)
          return 16384;

        if (parameter === 34024)
          return 16384;

        if (parameter === 7936)
          return "WebKit";

        if (parameter === 7937)
          return "WebGL 2.0";

        return originalGetParameter2
          .call(this, parameter);

      };

  }

  // Canvas measureText (Font Fingerprinting Protection)
  if (
    typeof CanvasRenderingContext2D !== "undefined" &&
    CanvasRenderingContext2D.prototype.measureText
  ) {
    const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;
    CanvasRenderingContext2D.prototype.measureText = function() {
      const metrics = originalMeasureText.apply(this, arguments);
      const noise = spoofFloat;
      
      return new Proxy(metrics, {
        get(target, prop) {
          if (typeof prop === "string" && [
            "width", 
            "actualBoundingBoxLeft", 
            "actualBoundingBoxRight", 
            "actualBoundingBoxAscent", 
            "actualBoundingBoxDescent",
            "fontBoundingBoxAscent",
            "fontBoundingBoxDescent"
          ].includes(prop)) {
            return target[prop] + noise;
          }
          const val = Reflect.get(target, prop);
          return typeof val === 'function' ? val.bind(target) : val;
        }
      });
    };
  }

  // Battery API
  if (navigator.getBattery) {

    const noopFn = () => {};

    navigator.getBattery =
      async () => ({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1,
        addEventListener: noopFn,
        removeEventListener: noopFn,
        dispatchEvent: () => true
      });

  }

  // Network Connection Spoofing
  if (navigator.connection) {
    Object.defineProperty(
      navigator,
      "connection",
      {
        get() {
          return {
            downlink: 10,
            effectiveType: "4g",
            rtt: 50,
            saveData: false
          };
        },
        configurable: true
      }
    );
  }

  // Hardware Media Device Protection
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    const originalEnumerate = navigator.mediaDevices.enumerateDevices;
    navigator.mediaDevices.enumerateDevices = async function() {
      const devices = await originalEnumerate.apply(this, arguments);
      return devices.map(device => {
        const genericLabel = device.kind === 'audioinput' ? 'Default Microphone' : 
                             device.kind === 'videoinput' ? 'Default Webcam' : 
                             device.kind === 'audiooutput' ? 'Default Speaker' : 'Default Device';
        return {
          deviceId: 'default',
          kind: device.kind,
          label: genericLabel,
          groupId: 'default',
          toJSON: function() { return this; }
        };
      });
    };
  }

  // Client Hints API Spoofing (navigator.userAgentData)
  if (navigator.userAgentData) {
    const originalGetHighEntropyValues = navigator.userAgentData.getHighEntropyValues;
    navigator.userAgentData.getHighEntropyValues = async function() {
      const values = await originalGetHighEntropyValues.apply(this, arguments);
      if (values.architecture) values.architecture = 'x86';
      if (values.bitness) values.bitness = '64';
      if (values.model) values.model = '';
      if (values.platformVersion) values.platformVersion = '10.0.0';
      return values;
    };
  }

  // Screen Spoofing
  const originalScreenDescriptors = {};
  for (const key of ["width", "height", "colorDepth", "pixelDepth", "availWidth", "availHeight"]) {
    originalScreenDescriptors[key] = Object.getOwnPropertyDescriptor(Screen.prototype, key) || Object.getOwnPropertyDescriptor(window.screen, key);
  }

  const spoofedScreen = {
    get width() { return Math.max(1920, window.outerWidth || 0); },
    get height() { return Math.max(1080, window.outerHeight || 0); },
    get colorDepth() { return 24; },
    get pixelDepth() { return 24; },
    get availWidth() { return Math.max(1920, window.outerWidth || 0); },
    get availHeight() { return Math.max(1040, window.outerHeight || 0); }
  };
  for (const key in spoofedScreen) {
    Object.defineProperty(window.screen, key, {
      get() { 
        const desc = Object.getOwnPropertyDescriptor(spoofedScreen, key);
        return desc.get ? desc.get() : spoofedScreen[key];
      },
      configurable: true
    });
  }

  // Font Fingerprinting Protection
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth"
  );
  
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetHeight"
  );

  if (originalOffsetWidth && originalOffsetHeight) {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      get() {
        const width = originalOffsetWidth.get.call(this);
        if (this.tagName === "SPAN" && this.style.fontSize && width > 0) {
          return width + (spoofSeed > 0.5 ? 1 : -1);
        }
        return width;
      },
      configurable: true
    });

    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      get() {
        const height = originalOffsetHeight.get.call(this);
        if (this.tagName === "SPAN" && this.style.fontSize && height > 0) {
          return height + (spoofSeed > 0.5 ? 1 : -1);
        }
        return height;
      },
      configurable: true
    });
  }

  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function() {
    const rect = originalGetBoundingClientRect.call(this);
    if (this.tagName === "SPAN" && this.style.fontSize) {
      return new DOMRect(
        rect.x,
        rect.y,
        rect.width + (spoofSeed > 0.5 ? 0.1 : -0.1),
        rect.height + (spoofSeed > 0.5 ? 0.1 : -0.1)
      );
    }
    return rect;
  };

  const originalGetClientRects = Element.prototype.getClientRects;
  Element.prototype.getClientRects = function() {
    const rects = originalGetClientRects.call(this);
    if (this.tagName === "SPAN" && this.style.fontSize && rects.length > 0) {
      return new Proxy(rects, {
        get(target, prop) {
          if (prop === 'length') return target.length;
          const index = Number(prop);
          if (!isNaN(index) && index >= 0 && index < target.length) {
            const rect = target[index];
            return new DOMRect(
              rect.x,
              rect.y,
              rect.width + (spoofSeed > 0.5 ? 0.1 : -0.1),
              rect.height + (spoofSeed > 0.5 ? 0.1 : -0.1)
            );
          }
          const val = Reflect.get(target, prop);
          return typeof val === 'function' ? val.bind(target) : val;
        }
      });
    }
    return rects;
  };



  console.log(
    "Advanced fingerprint protection enabled"
  );

  // Register all hooked functions for native toString spoofing
  try {
    hookedFunctions.add(Date.prototype.getTimezoneOffset);
    hookedFunctions.add(Intl.DateTimeFormat.prototype.resolvedOptions);
    hookedFunctions.add(HTMLCanvasElement.prototype.getContext);
    hookedFunctions.add(HTMLCanvasElement.prototype.toDataURL);
    hookedFunctions.add(HTMLCanvasElement.prototype.toBlob);
    hookedFunctions.add(CanvasRenderingContext2D.prototype.getImageData);
    if (window.WebGLRenderingContext) hookedFunctions.add(WebGLRenderingContext.prototype.readPixels);
    if (typeof WebGL2RenderingContext !== "undefined") hookedFunctions.add(WebGL2RenderingContext.prototype.readPixels);
    hookedFunctions.add(AudioBuffer.prototype.getChannelData);
    hookedFunctions.add(AnalyserNode.prototype.getFloatFrequencyData);
    hookedFunctions.add(AnalyserNode.prototype.getByteFrequencyData);
    hookedFunctions.add(CanvasRenderingContext2D.prototype.measureText);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight").get);
    hookedFunctions.add(Element.prototype.getBoundingClientRect);
    hookedFunctions.add(Element.prototype.getClientRects);
  } catch (e) {
    console.warn("UbiquiShield: Failed to mask some hooks", e);
  }

})();