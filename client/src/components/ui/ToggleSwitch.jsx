function ToggleSwitch({ enabled = true }) {

  return (

    <div
      className={`
        w-14
        h-8
        rounded-full
        flex
        items-center
        px-1
        transition-all
        duration-300
        ${enabled
          ? "bg-[#6d5dfc]"
          : "bg-[#2a2a35]"
        }
      `}
    >

      <div
        className={`
          w-6
          h-6
          rounded-full
          bg-white
          transition-all
          duration-300
          shadow-md
          ${enabled
            ? "translate-x-6"
            : "translate-x-0"
          }
        `}
      />

    </div>
  )
}

export default ToggleSwitch