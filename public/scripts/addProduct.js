document.addEventListener('DOMContentLoaded', () => {
  const imageNode = document.querySelector('#image')
  imageNode.addEventListener('input', (e)=>{
    console.log(e.target.value)
    const preview = document.querySelector('#imageLink')
    preview.setAttribute('src', `${e.target.value}`)
  })
})