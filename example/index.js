async function fn() {
  await new Promise((resolve, reject) => reject('报错'));
  await new Promise((resolve) => resolve(1));
  console.log('do something...');
}
fn();
