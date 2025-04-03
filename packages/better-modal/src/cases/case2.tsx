import NiceModal from '../../origin'

// 嵌套情况 并且 使用 id 注册
const App = () => {
  // @ts-ignore
  register('modal1', Modal1)

  return (
    <NiceModal.Provider>
      <Child />
      <button
        onClick={() => {
          // 预期 Modal1 应该渲染到 App 里（能消费APP的context）
          NiceModal.show('modal1')
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
    <NiceModal.Provider>
      child
      <button
        onClick={() => {
          // 预期 Modal1 应该渲染出来
          // ❌ 实际：没反应
          // 原因：modal1 在 App 里注册了，Child 的 Provider没有！

          NiceModal.show('modal1')
        }}
        type="button"
      >
        show child
      </button>
    </NiceModal.Provider>
  )
}
