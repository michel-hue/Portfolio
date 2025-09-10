<template>
  <div class="mon-gradient">
    <Header />

    <main>
      <NuxtPage />
    </main>
    <Footer /> 
  </div>
</template>
<style lang="scss">
.mon-gradient {
  width: 100%;
  height: 1000px;
  background-color: #000000; 
background-image: radial-gradient(
  ellipse 70% 50% at top center, 
  #0bdad3 0%,        
  #08a8a9 40%,       
  #000000 100%       
);

}



body{
  margin: 0;
  padding: 0;
  background-color: #000000;
  color: white;
}

</style>

