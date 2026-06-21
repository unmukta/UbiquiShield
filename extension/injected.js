(() => {

  const spoofSeed = Math.random();
  const spoofFloat = (spoofSeed - 0.5) * 0.0001;

  // =========================================
  // NATIVE HOOK MASKING (toString Proxy)
  // =========================================
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

  // =========================================
  // NAVIGATOR PROPERTY SPOOFING
  // =========================================

  // Hardware Concurrency
  Object.defineProperty(
    Navigator.prototype,
    "hardwareConcurrency",
    {
      get() { return 8; },
      configurable: true,
      enumerable: true
    }
  );

  // Device Memory
  Object.defineProperty(
    Navigator.prototype,
    "deviceMemory",
    {
      get() { return 8; },
      configurable: true,
      enumerable: true
    }
  );

  // Language Spoofing
  Object.defineProperty(
    Navigator.prototype,
    "language",
    {
      get() { return "en-US"; },
      configurable: true,
      enumerable: true
    }
  );

  Object.defineProperty(
    Navigator.prototype,
    "languages",
    {
      get() { return ["en-US", "en"]; },
      configurable: true,
      enumerable: true
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
      configurable: true,
      enumerable: true
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
      configurable: true,
      enumerable: true
    }
  );

  // User Agent Legacy Spoofing
  Object.defineProperty(Navigator.prototype, "userAgent", {
    get() { return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"; },
    configurable: true,
    enumerable: true
  });
  Object.defineProperty(Navigator.prototype, "appVersion", {
    get() { return "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"; },
    configurable: true,
    enumerable: true
  });
  Object.defineProperty(Navigator.prototype, "platform", {
    get() { return "Win32"; },
    configurable: true,
    enumerable: true
  });

  // =========================================
  // CLIENT HINTS SPOOFING (Single Hook)
  // =========================================
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
      configurable: true,
      enumerable: true
    });
  }

  // =========================================
  // BATTERY API SPOOFING (Single Hook)
  // =========================================
  if (navigator.getBattery) {
    const noopFn = () => {};
    navigator.getBattery = function() {
      return Promise.resolve({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1.0,
        onchargingchange: null,
        onchargingtimechange: null,
        ondischargingtimechange: null,
        onlevelchange: null,
        addEventListener: noopFn,
        removeEventListener: noopFn,
        dispatchEvent: () => true
      });
    };
    hookedFunctions.add(navigator.getBattery);
  }

  // =========================================
  // TIMEZONE SPOOFING (Consistent EST)
  // =========================================
  const originalResolvedOptions =
    Intl.DateTimeFormat.prototype.resolvedOptions;

  const OriginalDateTimeFormat = Intl.DateTimeFormat;

  // Preserve instanceof by using a wrapper that delegates
  const wrappedDateTimeFormat = function(...args) {
    const options = args[1] ? { ...args[1] } : {};
    options.timeZone = "America/New_York";
    return new OriginalDateTimeFormat(args[0], options);
  };
  wrappedDateTimeFormat.prototype = OriginalDateTimeFormat.prototype;
  Object.setPrototypeOf(wrappedDateTimeFormat, OriginalDateTimeFormat);
  wrappedDateTimeFormat.supportedLocalesOf = OriginalDateTimeFormat.supportedLocalesOf;
  Intl.DateTimeFormat = wrappedDateTimeFormat;

  // EST offset = 300 minutes (UTC-5), or 240 during EDT
  Date.prototype.getTimezoneOffset = function() {
    return 300;
  };

  Intl.DateTimeFormat.prototype.resolvedOptions =
    function() {
      const result = originalResolvedOptions.call(this);
      result.timeZone = "America/New_York";
      return result;
    };

  // =========================================
  // CANVAS FINGERPRINTING PROTECTION
  // =========================================
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

  // =========================================
  // OFFSCREEN CANVAS PROTECTION
  // =========================================
  if (window.OffscreenCanvas) {
    var originalOffscreenGetContext = OffscreenCanvas.prototype.getContext;
    OffscreenCanvas.prototype.getContext = function(contextId, ...args) {
      const ctx = originalOffscreenGetContext.apply(this, [contextId, ...args]);
      if (ctx && !contextTypes.has(this)) {
        contextTypes.set(this, contextId);
      }
      return ctx;
    };

    var originalConvertToBlob = OffscreenCanvas.prototype.convertToBlob;
    OffscreenCanvas.prototype.convertToBlob = function(...args) {
      const type = contextTypes.get(this);
      if (type === "2d") {
        try {
          const ctx = originalOffscreenGetContext.call(this, "2d");
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
      return originalConvertToBlob.apply(this, args);
    };
  }

  // =========================================
  // CANVAS IMAGE DATA PROTECTION
  // =========================================
  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

  CanvasRenderingContext2D.prototype.getImageData = function(...args) {
    const imageData = originalGetImageData.apply(this, args);
    if (imageData && imageData.data && imageData.data.length > 0) {
      const idx = Math.floor(spoofSeed * imageData.data.length);
      imageData.data[idx] = (imageData.data[idx] + 1) % 256;
    }
    return imageData;
  };

  if (window.OffscreenCanvasRenderingContext2D) {
    var originalOffscreenGetImageData = OffscreenCanvasRenderingContext2D.prototype.getImageData;
    OffscreenCanvasRenderingContext2D.prototype.getImageData = function(...args) {
      const imageData = originalOffscreenGetImageData.apply(this, args);
      if (imageData && imageData.data && imageData.data.length > 0) {
        const idx = Math.floor(spoofSeed * imageData.data.length);
        imageData.data[idx] = (imageData.data[idx] + 1) % 256;
      }
      return imageData;
    };
  }

  // =========================================
  // WEBGL PIXEL READBACK PROTECTION
  // =========================================
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

  // =========================================
  // WEBGL PARAMETER & EXTENSION SPOOFING
  // (Single unified hook — no duplicates)
  // =========================================
  if (window.WebGLRenderingContext) {
    const originalGetExtension = WebGLRenderingContext.prototype.getExtension;
    WebGLRenderingContext.prototype.getExtension = function(name) {
      if (name === "WEBGL_debug_renderer_info") return null;
      return originalGetExtension.call(this, name);
    };

    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) return "Google Inc.";           // UNMASKED_VENDOR_WEBGL
      if (parameter === 37446) return "ANGLE (Generic GPU)";   // UNMASKED_RENDERER_WEBGL
      if (parameter === 3379) return 4096;                     // MAX_TEXTURE_SIZE
      if (parameter === 34024) return 4096;                    // MAX_RENDERBUFFER_SIZE
      if (parameter === 7936) return "WebKit";                 // VENDOR
      if (parameter === 7937) return "WebGL";                  // RENDERER
      return originalGetParameter.call(this, parameter);
    };
  }

  if (typeof WebGL2RenderingContext !== "undefined") {
    var originalGetExtension2 = WebGL2RenderingContext.prototype.getExtension;
    WebGL2RenderingContext.prototype.getExtension = function(name) {
      if (name === "WEBGL_debug_renderer_info") return null;
      return originalGetExtension2.call(this, name);
    };

    var originalGetParameter2 = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) return "Google Inc.";
      if (parameter === 37446) return "ANGLE (Generic GPU)";
      if (parameter === 3379) return 16384;
      if (parameter === 34024) return 16384;
      if (parameter === 7936) return "WebKit";
      if (parameter === 7937) return "WebGL 2.0";
      return originalGetParameter2.call(this, parameter);
    };
  }

  // =========================================
  // AUDIO FINGERPRINTING PROTECTION
  // =========================================
  if (window.AudioBuffer && AudioBuffer.prototype.getChannelData) {
    var originalGetChannelData = AudioBuffer.prototype.getChannelData;
    AudioBuffer.prototype.getChannelData = function() {
      const results = originalGetChannelData.apply(this, arguments);
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

  // =========================================
  // CANVAS MEASURETEXT (Font Fingerprinting)
  // =========================================
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

  if (
    typeof OffscreenCanvasRenderingContext2D !== "undefined" &&
    OffscreenCanvasRenderingContext2D.prototype.measureText
  ) {
    var originalOffscreenMeasureText = OffscreenCanvasRenderingContext2D.prototype.measureText;
    OffscreenCanvasRenderingContext2D.prototype.measureText = function() {
      const metrics = originalOffscreenMeasureText.apply(this, arguments);
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

  // =========================================
  // NETWORK CONNECTION SPOOFING (with event stubs)
  // =========================================
  if (navigator.connection) {
    const noopFn = () => {};
    Object.defineProperty(
      navigator,
      "connection",
      {
        get() {
          return {
            downlink: 10,
            effectiveType: "4g",
            rtt: 50,
            saveData: false,
            onchange: null,
            addEventListener: noopFn,
            removeEventListener: noopFn,
            dispatchEvent: () => true
          };
        },
        configurable: true,
        enumerable: true
      }
    );
  }

  // =========================================
  // HARDWARE MEDIA DEVICE PROTECTION
  // =========================================
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

  // =========================================
  // SCREEN SPOOFING
  // =========================================
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
      configurable: true,
      enumerable: true
    });
  }

  // =========================================
  // ELEMENT OFFSET SPOOFING (Font Fingerprinting)
  // =========================================
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
  if (originalOffsetWidth) {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      get() {
        const width = originalOffsetWidth.get.call(this);
        if (this.tagName === "SPAN" && width > 0) {
          const noise = Math.floor((this.innerHTML.length + spoofSeed * 100) % 3) - 1;
          return width + noise;
        }
        return width;
      },
      configurable: true,
      enumerable: true
    });

    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      get() {
        const height = originalOffsetHeight.get.call(this);
        if (this.tagName === "SPAN" && height > 0) {
          const noise = Math.floor((this.innerHTML.length + spoofSeed * 100) % 3) - 1;
          return height + noise;
        }
        return height;
      },
      configurable: true,
      enumerable: true
    });
  }

  // =========================================
  // BOUNDING CLIENT RECT SPOOFING
  // =========================================
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function() {
    const rect = originalGetBoundingClientRect.call(this);
    if (this.tagName === "SPAN" && rect.width > 0) {
      const noiseX = (Math.floor((this.innerHTML.length + spoofSeed * 100) % 3) - 1) * 0.1;
      const noiseY = (Math.floor((this.innerHTML.length + spoofSeed * 200) % 3) - 1) * 0.1;
      return new DOMRect(
        rect.x,
        rect.y,
        rect.width + noiseX,
        rect.height + noiseY
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

  console.log("Advanced fingerprint protection enabled");

  // =========================================
  // REGISTER ALL HOOKS FOR toString MASKING
  // =========================================
  try {
    hookedFunctions.add(Date.prototype.getTimezoneOffset);
    hookedFunctions.add(Intl.DateTimeFormat.prototype.resolvedOptions);
    hookedFunctions.add(HTMLCanvasElement.prototype.getContext);
    hookedFunctions.add(HTMLCanvasElement.prototype.toDataURL);
    hookedFunctions.add(HTMLCanvasElement.prototype.toBlob);
    hookedFunctions.add(CanvasRenderingContext2D.prototype.getImageData);

    if (window.WebGLRenderingContext) {
      hookedFunctions.add(WebGLRenderingContext.prototype.readPixels);
      hookedFunctions.add(WebGLRenderingContext.prototype.getParameter);
      hookedFunctions.add(WebGLRenderingContext.prototype.getExtension);
    }
    if (typeof WebGL2RenderingContext !== "undefined") {
      hookedFunctions.add(WebGL2RenderingContext.prototype.readPixels);
      hookedFunctions.add(WebGL2RenderingContext.prototype.getParameter);
      hookedFunctions.add(WebGL2RenderingContext.prototype.getExtension);
    }

    if (window.AudioBuffer) hookedFunctions.add(AudioBuffer.prototype.getChannelData);
    if (window.AnalyserNode) {
      hookedFunctions.add(AnalyserNode.prototype.getFloatFrequencyData);
      hookedFunctions.add(AnalyserNode.prototype.getByteFrequencyData);
    }

    hookedFunctions.add(CanvasRenderingContext2D.prototype.measureText);

    if (window.OffscreenCanvas) {
      hookedFunctions.add(OffscreenCanvas.prototype.getContext);
      hookedFunctions.add(OffscreenCanvas.prototype.convertToBlob);
    }
    if (window.OffscreenCanvasRenderingContext2D) {
      hookedFunctions.add(OffscreenCanvasRenderingContext2D.prototype.getImageData);
      hookedFunctions.add(OffscreenCanvasRenderingContext2D.prototype.measureText);
    }

    hookedFunctions.add(Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(Navigator.prototype, "userAgent").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(Navigator.prototype, "appVersion").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(Navigator.prototype, "platform").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(Navigator.prototype, "mimeTypes").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(Navigator.prototype, "plugins").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(Navigator.prototype, "languages").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(Navigator.prototype, "deviceMemory").get);
    hookedFunctions.add(Object.getOwnPropertyDescriptor(Navigator.prototype, "hardwareConcurrency").get);
    hookedFunctions.add(Element.prototype.getBoundingClientRect);
    hookedFunctions.add(Element.prototype.getClientRects);
    if (navigator.mediaDevices) hookedFunctions.add(navigator.mediaDevices.enumerateDevices);
  } catch (e) {
    console.warn("UbiquiShield: Failed to mask some hooks", e);
  }

})();