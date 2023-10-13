import {Box, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack} from "@chakra-ui/react";


export const Slidey = props => {
  const { id, value, min, max, markers } = props
  const { onChange } = props

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }

  return (
    <Box pt={6} pb={2} width="full">
      <Slider aria-label='slider-ex-6' min={min} max={max} width={"full"} onChange={(value) => onChange({target: { id, value }})}>
        {markers.map((mark, i) => (
        <SliderMark key={`marker_${i}`} value={mark} {...labelStyles}>
          {mark}
        </SliderMark>
        ))}
        <SliderMark
          value={value}
          textAlign='center'
          bg='blue.500'
          color='white'
          mt='-10'
          ml='-5'
          w='12'
        >
          {value}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  )
}
