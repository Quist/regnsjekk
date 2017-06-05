//@flow

export type Timemelding = {
  $: {
    from: string
  },
  precipitation: {
    $: {
      value: string
    }
  }
}

export type YrVærmelding = {
  forecast: {
      tabular: {
        timse: [Timemelding]
      }
    }
}
