```js
{
  button: {
    display: 'block',

    '[disabled]': {
      color: 'gray',
    }

    ':hover': {
      color: 'red',

      '[disabled]': {
        color: 'black',
      },
    },

    '@media': {
      '(max-width: 300)': {
        ':hover': {
          color: 'blue'
        }
      }
    }
  }
}
```
