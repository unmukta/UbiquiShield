(() => {
  Object.defineProperty(
    Navigator.prototype,
    "hardwareConcurrency",
    {
      get() {
        return 8;
      }
    }
  );

  Object.defineProperty(
    Navigator.prototype,
    "deviceMemory",
    {
      get() {
        return 8;
      }
    }
  );

  const originalGetParameter =
    WebGLRenderingContext.prototype.getParameter;

  WebGLRenderingContext.prototype.getParameter =
    function(parameter) {

      if (parameter === 37445)
        return "Google Inc.";

      if (parameter === 37446)
        return "ANGLE (Generic GPU)";

      return originalGetParameter.call(
        this,
        parameter
      );
    };

})();