(() => {

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

  // Platform
  Object.defineProperty(
    Navigator.prototype,
    "platform",
    {
      get() {
        return "Win32";
      },
      configurable: true
    }
  );

  // Language
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

  const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
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
      imageData.data[0] = (imageData.data[0] + 1) % 256;
    }
    return imageData;
  };

  // Audio Fingerprinting Protection
  if (
    window.AudioBuffer &&
    AudioBuffer.prototype.getChannelData
  ) {

    const originalGetChannelData =
      AudioBuffer.prototype.getChannelData;

    AudioBuffer.prototype.getChannelData =
      function() {

        const results =
          originalGetChannelData.apply(
            this,
            arguments
          );

        if (results.length > 0) {

          results[0] =
            results[0] + 0.0000001;

        }

        return results;

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

    const originalGetExtension2 =
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

    const originalGetParameter2 =
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
          return width + (Math.random() > 0.5 ? 1 : -1);
        }
        return width;
      },
      configurable: true
    });

    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      get() {
        const height = originalOffsetHeight.get.call(this);
        if (this.tagName === "SPAN" && this.style.fontSize && height > 0) {
          return height + (Math.random() > 0.5 ? 1 : -1);
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
      return {
        x: rect.x, y: rect.y,
        width: rect.width + (Math.random() > 0.5 ? 0.1 : -0.1),
        height: rect.height + (Math.random() > 0.5 ? 0.1 : -0.1),
        top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left,
        toJSON: () => rect.toJSON()
      };
    }
    return rect;
  };

  const originalGetClientRects = Element.prototype.getClientRects;
  Element.prototype.getClientRects = function() {
    const rects = originalGetClientRects.call(this);
    if (this.tagName === "SPAN" && this.style.fontSize && rects.length > 0) {
      const spoofedRects = [];
      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        spoofedRects.push({
          x: rect.x, y: rect.y,
          width: rect.width + (Math.random() > 0.5 ? 0.1 : -0.1),
          height: rect.height + (Math.random() > 0.5 ? 0.1 : -0.1),
          top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left,
          toJSON: () => rect.toJSON()
        });
      }
      return spoofedRects;
    }
    return rects;
  };

  // WebGL Noise (readPixels)
  const originalReadPixels = WebGLRenderingContext.prototype.readPixels;
  WebGLRenderingContext.prototype.readPixels = function(...args) {
    originalReadPixels.apply(this, args);
    if (args[6] && args[6].length > 0) {
      args[6][0] = (args[6][0] + 1) % 256;
    }
  };

  if (typeof WebGL2RenderingContext !== "undefined") {
    const originalReadPixels2 = WebGL2RenderingContext.prototype.readPixels;
    WebGL2RenderingContext.prototype.readPixels = function(...args) {
      originalReadPixels2.apply(this, args);
      if (args[6] && args[6].length > 0) {
        args[6][0] = (args[6][0] + 1) % 256;
      }
    };
  }

  console.log(
    "Advanced fingerprint protection enabled"
  );

})();