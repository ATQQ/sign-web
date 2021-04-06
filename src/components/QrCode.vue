<template>
  <img :src="src" />
</template>
<script>
export default {
  name: "QrCode",
  props: {
    value: String
  },
  data() {
    return {
      src: ""
    };
  },
  watch: {
    value(to) {
      if (!to) {
        return;
      }
      this.src = this.createEwm(to);
    }
  },
  methods: {
    createEwm(text, config) {
      // eslint-disable-next-line no-undef
      const canvasImg = new AraleQRCode({
        text,
        size: 400,
        foreground: "#000",
        ...config
      });
      return canvasImg.toDataURL("image/png");
    }
  },
  mounted() {
    if (this.value) {
      this.src = this.createEwm(this.value);
    }
  }
};
</script>
