
import { Autocomplete, Box, TextField, debounce } from '@mui/material'

type propsType = {
    onChangeSearchValue: (value: string) => void;
    onChangeDishType: (value: string[]) => void;
}

export function RecipeFilter(props: propsType) {
    const dishOptions = ['Biscuits and cookies', 'Bread', 'Cereals', 'Condiments and sauces', 'Desserts', 'Drinks', 'Main course', 'Pancake', 'Preps', 'Preserve', 'Salad', 'Sandwiches', 'Side dish', 'Soup', 'Starter', 'Sweets']

    const onSearchValueChange = debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => { props.onChangeSearchValue(e.target.value) }
        , 300);

    const onDishTypeChange = debounce(
        (e: string[]) => { props.onChangeDishType(e) }
        , 300);

    return (
        <>
            <Box m={2} p={3} sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <TextField
                    style={{ width: '300px' }}
                    type="text" label="Search"
                    onChange={onSearchValueChange}
                />
                <Autocomplete
                    style={{ width: '300px' }}
                    multiple
                    id="tags-standard"
                    options={dishOptions}
                    onChange={(e, selectedOptions) => {
                        onDishTypeChange(selectedOptions);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="DishType"
                        />
                    )}
                />

            </Box>
        </>
    )
}