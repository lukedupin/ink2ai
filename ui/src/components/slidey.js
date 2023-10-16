import {Box, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack} from "@chakra-ui/react";


export const Slidey = props => {
  const { id, value, min, max, markers, marker_cb } = props
  const { onChange } = props

  const marker_start_end = !!props.marker_start_end

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }

  const clean_markers = []
  for ( let i = 0; i < markers; i++ ) {
    const value = ( marker_start_end )? i * ((max - min) / (markers - 1)): (i + 1) * ((max - min) / (markers + 1))
    clean_markers.push( value )
  }

  return (
    <Box pt={6} pb={2} pl={16} pr={16} width="full">
      <Slider aria-label='slider-ex-6'
              width="full"
              max={max}
              min={min}
              value={value}
              onChange={(value) => onChange({target: { id, value }})}>
        {clean_markers.map((marker, i) => (
        <SliderMark key={`marker_${i}`} value={marker} {...labelStyles}>
          {marker_cb( marker )}
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
          {marker_cb(value)}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  )
}
