<svelte:options customElement="goa-work-side-nav" />

<script lang="ts">

</script>

<div class="root">
  <a href="#" class="item"><goa-icon type="list"></goa-icon></a>
  <a href="#" class="item active"><goa-icon type="person-add" theme="filled"></goa-icon></a>
  <a href="#" class="item"><goa-icon type="person"></goa-icon></a>
  <a href="#" class="item"><goa-icon type="briefcase"></goa-icon></a>
  <a href="#" class="item"><goa-icon type="book"></goa-icon></a>
  <a href="#" class="item"><goa-icon type="chatbubble"></goa-icon></a>
  <a href="#" class="item"><goa-icon type="calendar-clear"></goa-icon></a>
</div>

<style>
  .root {
    padding: 24px 0 24px 0;
    gap: 8px;
    display: flex;
    flex-direction: column;
    background: #F8F8F8;
    width: 56px;
    align-items: center;
  }

  .item {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item.active,
  .item:hover {
    background-color: #CEDFEE;
  }
</style>