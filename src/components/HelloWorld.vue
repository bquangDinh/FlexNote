<template>
  <div>
    <h3>Flexpad</h3>
    <p>Select any text that you wanna explore, click flex pad button which will be poped up. The Flexpad will be opened automatically.</p>
    <p>Enjoy!</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted () {
    browser.runtime.sendMessage({})
  },
  computed: {
    defaultText () {
      return browser.i18n.getMessage('extName')
    }
  }
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
