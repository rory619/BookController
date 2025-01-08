package ie.atu.bookcontroller;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.Arrays;
import java.util.List;

class BookServiceTest {

    @Test
    void testCreateBook() {

        BookRepository mockRepository = Mockito.mock(BookRepository.class);

        BookService bookService = new BookService(mockRepository);

        Book book = new Book(1L, "Test Title", "Test Author", 19.99);
        Mockito.when(mockRepository.save(book)).thenReturn(book);

        Book result = bookService.createBook(book);
        assertEquals(book, result);
    }

    @Test
    void testGetBookById() {

        BookRepository mockRepository = Mockito.mock(BookRepository.class);
        BookService bookService = new BookService(mockRepository);

        Book book = new Book(1L, "Test Title", "Test Author", 19.99);
        Mockito.when(mockRepository.findById(1L)).thenReturn(Optional.of(book));

        Book result = bookService.getBookById(1L);
        assertEquals(book, result);
    }

    @Test
    void testGetAllBooks() {

        BookRepository mockRepository = Mockito.mock(BookRepository.class);
        BookService bookService = new BookService(mockRepository);

        List<Book> books = Arrays.asList(
                new Book(1L, "Book 1", "Author 1", 10.99),
                new Book(2L, "Book 2", "Author 2", 15.99)
        );
        Mockito.when(mockRepository.findAll()).thenReturn(books);

        List<Book> result = bookService.getAllBooks();
        assertEquals(2, result.size());
    }

    @Test
    void testUpdateBook() {

        BookRepository mockRepository = Mockito.mock(BookRepository.class);
        BookService bookService = new BookService(mockRepository);

        Book existingBook = new Book(1L, "Old Title", "Old Author", 9.99);
        Book updatedBook = new Book(1L, "New Title", "New Author", 12.99);

        Mockito.when(mockRepository.findById(1L)).thenReturn(Optional.of(existingBook));
        Mockito.when(mockRepository.save(existingBook)).thenReturn(updatedBook);

        Book result = bookService.updateBook(1L, updatedBook);
        assertEquals("New Title", result.getTitle());
        assertEquals("New Author", result.getAuthor());
    }

    @Test
    void testDeleteBookById() {

        BookRepository mockRepository = Mockito.mock(BookRepository.class);
        BookService bookService = new BookService(mockRepository);

        Mockito.when(mockRepository.existsById(1L)).thenReturn(true);


        assertDoesNotThrow(() -> bookService.deleteBookById(1L));

        Mockito.verify(mockRepository).deleteById(1L);
    }
}