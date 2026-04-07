import type { ExtractedRecipe } from '@slowcook/shared'
import { createContext, useCallback, useMemo, useReducer } from 'react'

interface AddBookState {
  coverUri: string
  title: string
  author: string
  indexUris: string[]
  recipes: ExtractedRecipe[]
}

type AddBookAction =
  | { type: 'SET_COVER'; uri: string }
  | { type: 'SET_META'; title: string; author: string }
  | { type: 'SET_INDEX_URIS'; uris: string[] }
  | { type: 'SET_RECIPES'; recipes: ExtractedRecipe[] }
  | { type: 'UPDATE_RECIPE'; index: number; recipe: ExtractedRecipe }
  | { type: 'REMOVE_RECIPE'; index: number }
  | { type: 'RESET' }

const initialState: AddBookState = {
  coverUri: '',
  title: '',
  author: '',
  indexUris: [],
  recipes: [],
}

function reducer(state: AddBookState, action: AddBookAction): AddBookState {
  switch (action.type) {
    case 'SET_COVER':
      return { ...state, coverUri: action.uri }
    case 'SET_META':
      return { ...state, title: action.title, author: action.author }
    case 'SET_INDEX_URIS':
      return { ...state, indexUris: action.uris }
    case 'SET_RECIPES':
      return { ...state, recipes: action.recipes }
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map((r, i) => (i === action.index ? action.recipe : r)),
      }
    case 'REMOVE_RECIPE':
      return { ...state, recipes: state.recipes.filter((_, i) => i !== action.index) }
    case 'RESET':
      return initialState
  }
}

export interface AddBookContextValue {
  state: AddBookState
  dispatch: React.Dispatch<AddBookAction>
  setCover: (uri: string) => void
  setMeta: (title: string, author: string) => void
  setIndexUris: (uris: string[]) => void
  setRecipes: (recipes: ExtractedRecipe[]) => void
  reset: () => void
}

export const AddBookContext = createContext<AddBookContextValue | null>(null)

export function AddBookProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setCover = useCallback((uri: string) => dispatch({ type: 'SET_COVER', uri }), [])
  const setMeta = useCallback(
    (title: string, author: string) => dispatch({ type: 'SET_META', title, author }),
    [],
  )
  const setIndexUris = useCallback(
    (uris: string[]) => dispatch({ type: 'SET_INDEX_URIS', uris }),
    [],
  )
  const setRecipes = useCallback(
    (recipes: ExtractedRecipe[]) => dispatch({ type: 'SET_RECIPES', recipes }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const value = useMemo(
    () => ({ state, dispatch, setCover, setMeta, setIndexUris, setRecipes, reset }),
    [state, setCover, setMeta, setIndexUris, setRecipes, reset],
  )

  return <AddBookContext value={value}>{children}</AddBookContext>
}
