package ie.atu.bookcontroller;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Create book
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    // Get a book
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));
    }

    // Get all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Update
    public Book updateBook(Long id, Book bookDetails) {
        Book book = getBookById(id);

        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setPrice(bookDetails.getPrice());

        return bookRepository.save(book);
    }

    // Delete with error message
    public void deleteBookById(Long id) {
        if (!bookRepository.existsById(id)) {

            throw new RuntimeException("Book not found with ID: " + id);
        }
        bookRepository.deleteById(id);
    }
}
