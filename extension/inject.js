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

  // Canvas
  const originalToDataURL =
    HTMLCanvasElement.prototype.toDataURL;

  HTMLCanvasElement.prototype.toDataURL =
    function (...args) {

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

      return originalToDataURL.apply(
        this,
        args
      );
    };

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
    function(param) {

      if (
        param === 37445 ||
        param === 37446
      ) {
        return "Blocked";
      }

      return originalGetParameter.call(
        this,
        param
      );
    };

  // Battery
  if (navigator.getBattery) {

    navigator.getBattery =
      async () => ({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1
      });

  }

  console.log(
    "Ubiqui Shield inject.js active"
  );

})();