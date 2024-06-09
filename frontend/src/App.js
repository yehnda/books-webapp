import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKS } from './queries';
import './App.css';
import {
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Autocomplete,
  Snackbar,
  Alert,
  Link,
} from '@mui/material';

function App() {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingList, setReadingList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const filteredBooks = data.books.filter(book => {
    const regex = new RegExp(`\\b${searchQuery}\\b`, 'i');
    return regex.test(book.title);
  }).sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    const query = searchQuery.toLowerCase();

    // Prioritize titles that start with the search query
    if (titleA.startsWith(query) && !titleB.startsWith(query)) return -1;
    if (!titleA.startsWith(query) && titleB.startsWith(query)) return 1;

    // For titles that don't start with the search query, sort alphabetically
    return titleA.localeCompare(titleB);
  });

  const addToReadingList = (book) => {
    if (!readingList.some(item => item.title === book.title)) {
      setReadingList([...readingList, book]);
      setSnackbarMessage(`${book.title} added to reading list`);
    } else {
      setSnackbarMessage(`${book.title} is already in the reading list`);
    }
    setSnackbarOpen(true);
  };

  const removeFromReadingList = (book) => {
    setReadingList(readingList.filter(item => item.title !== book.title));
    setSnackbarMessage(`${book.title} removed from reading list`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getBookImage = (coverPhotoURL) => {
    let imagePath = coverPhotoURL.replace(/^\/?assets\//, '');
    imagePath = `/assets/${imagePath}`;
    console.log(`Loading image from path: ${imagePath}`);
    return imagePath;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Books
      </Typography>
      {/* Anchor link to the reading list */}
      <Link href="#reading-list" color="inherit" style={{ marginBottom: '20px', display: 'block' }}>Reading List</Link>
      <Autocomplete
        freeSolo
        options={inputValue ? data.books.filter(book => book.title.toLowerCase().includes(inputValue.toLowerCase())) : []}
        getOptionLabel={(option) => option.title}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          setSearchQuery(newInputValue);
        }}
        renderOption={(props, option) => (
          <li {...props}>
            <img src={getBookImage(option.coverPhotoURL)} alt={option.title} style={{ width: '40px', marginRight: '10px' }} />
            <div style={{ flex: 1 }}>
              <Typography variant="body1">{option.title}</Typography>
              <Typography variant="body2" color="textSecondary">Author: {option.author}</Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addToReadingList(option)}
              style={{ marginLeft: '10px' }}
            >
              Add
            </Button>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            placeholder="Search for a book"
            margin="normal"
          />
        )}
      />

      {filteredBooks.length === 0 && (
        <Typography variant="body1" gutterBottom>
          Book not available
        </Typography>
      )}

      <Grid container spacing={2}>
        {filteredBooks.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={getBookImage(book.coverPhotoURL)}
                alt={book.title}
              />
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1">Author: {book.author}</Typography>
                <Typography variant="subtitle2">Reading Level: {book.readingLevel}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToReadingList(book)}
                  style={{ marginTop: '10px' }}
                >
                  Add to Reading List
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Anchor link target */}
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }} id="reading-list">
        Reading List
      </Typography>
      <List>
        {readingList.map((book, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={book.title}
              secondary={`Author: ${book.author}`}
            />
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => removeFromReadingList(book)}
              >
                Remove
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {/* Back to Top link */}

      <Typography variant="body1" gutterBottom>
        <Link href="#" color="inherit">Back to Top</Link>
      </Typography>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
