function Toggle({

  enabled,
  onClick

}) {

  return (

    <div
      onClick={onClick}
      className={`
        w-14
        h-8
        rounded-full
        relative
        cursor-pointer
        transition-all
        ${
          enabled
            ? "bg-[#5b4dff]"
            : "bg-[#2b2d37]"
        }
      `}
    >

      <div
        className={`
          absolute
          top-1
          w-6
          h-6
          rounded-full
          bg-white
          transition-all
          ${
            enabled
              ? "right-1"
              : "left-1"
          }
        `}
      />

    </div>

  )

}

export default Toggle