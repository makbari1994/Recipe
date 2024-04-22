import { Box, Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import fetch from 'cross-fetch'
import { Hits, Links, Recipe } from '../models'
import RecipeItem from '../recipe-item/recipe-item'
import { RecipeFilter } from '../recipe-filter/recipe-filter'
import { environment } from '../../environments/environment'
import { RecipeSkeleton } from './recipe-skeleton'

/* eslint-disable-next-line */
export interface RecipeListProps { }

export function RecipeList(props: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>();
  const [searchValue, setSearchValue] = useState<string>('')
  const [dishType, setDishType] = useState<string[]>([])
  const [apiUrl, setApiUrl] = useState<string | undefined>('');
  const [apiUrls, setApiUrls] = useState<string[]>([]);
  const [links, setLinks] = useState<Links | undefined>({} as Links);
  const [paginationClicked, setPaginationClicked] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const getApiResponse = async <T extends unknown>(): Promise<T> => {
      const appId = environment.appId;
      const appKey = environment.appKey;
      let api_url = `${environment.api_url}&
      app_id=${appId}&
      app_key=${appKey}`
      if (searchValue) {
        api_url += `&q=${searchValue}`
      }
      if (dishType && dishType.length > 0) {
        dishType.map((item) => {
          api_url += `&dishType=${item}`
        })
      }

      if (apiUrl && paginationClicked) {
        api_url = apiUrl;
        setPaginationClicked(false);
      }
      else {
        setApiUrls([api_url])
      }

      const response = await fetch(api_url)
      const data = (await response.json()) as Promise<T>

      return data
    }
    const fetchRecipes = async () => {
      setLoading(true)
      const response = await getApiResponse<Hits>()
      setLinks(response._links);
      setRecipes(response.hits.map((h) => h.recipe))
      setLoading(false)
    }
    fetchRecipes()
  }, [searchValue, dishType, apiUrl])


  const onChangeSearchValue = (value: string) => {
    setSearchValue(value)
  }

  const onChangeDishType = (value: string[]) => {
    setDishType(value)
  }

  const nextPage = () => {
    setPaginationClicked(true);
    /// save api urls
    setApiUrls(prev => [...prev, String(links?.next?.href)])
    setApiUrl(links?.next?.href)
    setPage(page => page + 1);
  }

  const previousPage = () => {
    setPaginationClicked(true);
    setPage(page => page - 1);
    if (page == 2) {
      setApiUrls([])
    }
    setApiUrl(apiUrls[page - 2]);
    /// remove last api url
    apiUrls.splice(apiUrls.length - 1, 1)
    setApiUrls([...apiUrls])
  }

  return (
    <>
      <RecipeFilter onChangeSearchValue={onChangeSearchValue} onChangeDishType={onChangeDishType} />
      <Box m={2} p={3} sx={{ display: 'flex', gap: '10px' }}>
        {apiUrls.length > 1 ? (
          <Button variant="outlined" color="error" onClick={previousPage}>Previos Page</Button>
        ) : null}
        {links?.next?.href ? (
          <Button variant="outlined" onClick={nextPage}>Next Page</Button>
        ) : null}
      </Box>

      {loading ? (
        <Grid container spacing={4}>
          {Array.from(Array(10).keys())?.map((r) => (
            <Grid item sm={3} key={r}>
              <RecipeSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={4}>
          {recipes?.map((r) => (
            <Grid item sm={3} key={r.uri}>
              <RecipeItem recipe={r} loading={loading} />
            </Grid>
          ))}
        </Grid>
      )
      }

    </>
  )
}

export default RecipeList
