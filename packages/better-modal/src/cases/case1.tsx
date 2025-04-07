// 嵌套情况
const App = () => {
  return (
    <NiceModal.Provider>
      <Child />
      <button
        onClick={() => {
          // 预期 Modal1 应该渲染到 App 里（能消费APP的context）
          // @ts-ignore
          NiceModal.show(Modal1)
        }}
        type="button"
      >
        show child
      </button>
    </NiceModal.Provider>
  )
}

const Child = () => {
  return (
    <>
      <NiceModal.Provider>
        child
        <button
          onClick={() => {
            // 预期 Modal2 应该渲染到 Child 里（能消费Child的context）
            // @ts-ignore
            NiceModal.show(Modal2)
          }}
          type="button"
        >
          show child
        </button>
      </NiceModal.Provider>
      <NiceModal.Provider>
        child
        <button
          onClick={() => {
            // 预期 Modal2 应该渲染到 Child 里（能消费Child的context）
            // @ts-ignore
            NiceModal.show(Modal2)
          }}
          type="button"
        >
          show child
        </button>
      </NiceModal.Provider>
    </>
  )
}
