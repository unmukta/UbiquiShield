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

  Intl.DateTimeFormat.prototype.resolvedOptions =
    function() {

      const result =
        originalResolvedOptions.call(this);

      result.timeZone =
        "UTC";

      return result;
    };

  // Canvas Fingerprinting Protection
  const originalToDataURL =
    HTMLCanvasElement.prototype.toDataURL;

  HTMLCanvasElement.prototype.toDataURL =
    function(...args) {

      try {

        const ctx =
          this.getContext("2d");

        if (ctx) {

          ctx.fillStyle =
            "rgba(1,1,1,0.01)";

          ctx.fillRect(
            0,
            0,
            1,
            1
          );

        }

      } catch {
        // Canvas may have a WebGL context
      }

      return originalToDataURL.apply(
        this,
        args
      );

    };

  const originalToBlob =
    HTMLCanvasElement.prototype.toBlob;

  HTMLCanvasElement.prototype.toBlob =
    function(...args) {

      try {

        const ctx =
          this.getContext("2d");

        if (ctx) {

          ctx.fillStyle =
            "rgba(1,1,1,0.01)";

          ctx.fillRect(
            0,
            0,
            1,
            1
          );

        }

      } catch {
        // Canvas may have a WebGL context
      }

      return originalToBlob.apply(
        this,
        args
      );

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

  console.log(
    "Advanced fingerprint protection enabled"
  );

})();