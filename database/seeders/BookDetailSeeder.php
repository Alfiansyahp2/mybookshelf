<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\User;
use App\Models\Shelf;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing books to avoid conflicts
        $this->command->info('Clearing existing book data...');
        DB::statement('TRUNCATE TABLE books CASCADE');

        $user = User::first();
        $shelves = Shelf::all()->keyBy('id');

        $books = [
            // Currently Reading with detailed data
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Atomic Habits',
                'author' => 'James Clear',
                'isbn' => '978-0735211292',
                'genre' => 'Self-Help',
                'language' => 'English',
                'publisher' => 'Avery',
                'publish_year' => 2018,
                'pages' => 320,
                'format' => 'hardcover',
                'spine_color_light' => '#2C5F2D',
                'spine_color_medium' => '#3A7B3E',
                'spine_color_dark' => '#4A8B4F',
                'height' => 'medium',
                'thickness' => 'regular',
                'status' => 'reading',
                'favorite' => false,
                'current_page' => 156,
                'progress' => 48.75,
                'started_date' => '2024-05-15 10:00:00',
                'personal_rating' => 4.5,
                'personal_notes' => "Excellent book on building good habits and breaking bad ones. The 1% better every day concept is really powerful. Love the practical actionable advice.

Key takeaways:
- Focus on systems rather than goals
- Make it obvious, attractive, easy, and satisfying
- Environment design matters more than motivation
- Tracking habits helps maintain consistency

Already implemented the habit stacking technique in my morning routine.",
                'shelf_id' => $shelves->first()->id,
                'position' => 0,
                'date_added' => '2024-05-01 00:00:00',
                'last_modified' => '2024-06-27 06:00:00',
                'purchase_date' => '2024-04-20 00:00:00',
                'purchase_price' => 24.99,
                'purchase_location' => 'Amazon',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Dune',
                'author' => 'Frank Herbert',
                'isbn' => '978-0441172719',
                'genre' => 'Science Fiction',
                'language' => 'English',
                'publisher' => 'Ace',
                'publish_year' => 1965,
                'pages' => 896,
                'format' => 'paperback',
                'spine_color_light' => '#C4A35A',
                'spine_color_medium' => '#8B7355',
                'spine_color_dark' => '#D4A574',
                'height' => 'tall',
                'thickness' => 'thick',
                'status' => 'reading',
                'favorite' => true,
                'current_page' => 234,
                'progress' => 26.11,
                'started_date' => '2024-06-01 14:30:00',
                'personal_rating' => 5.0,
                'personal_notes' => "Absolutely epic sci-fi masterpiece! The world-building is incredible - the political intrigue, the ecology of Arrakis, the Fremen culture.

Paul\'s character development is fascinating to watch. The way Herbert weaves in themes of religion, politics, and ecology is brilliant.

Slow to start but completely worth it. The Bene Gesserit and their plans within plans add so much depth.

Can\'t wait to see how the story unfolds in the later books.",
                'shelf_id' => $shelves->first()->id,
                'position' => 1,
                'date_added' => '2024-05-15 00:00:00',
                'last_modified' => '2024-06-27 06:00:00',
                'purchase_date' => '2024-05-10 00:00:00',
                'purchase_price' => 18.99,
                'purchase_location' => 'Bookstore',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'The Psychology of Money',
                'author' => 'Morgan Housel',
                'isbn' => '978-0857197689',
                'genre' => 'Finance',
                'language' => 'English',
                'publisher' => 'Harriman House',
                'publish_year' => 2020,
                'pages' => 256,
                'format' => 'ebook',
                'spine_color_light' => '#1E40AF',
                'spine_color_medium' => '#2563EB',
                'spine_color_dark' => '#3B82F6',
                'height' => 'short',
                'thickness' => 'thin',
                'status' => 'reading',
                'favorite' => false,
                'current_page' => 89,
                'progress' => 34.77,
                'started_date' => '2024-06-10 09:00:00',
                'personal_rating' => 4.0,
                'personal_notes' => "Really insightful perspective on money and investing. Housel emphasizes that doing well with money has little to do with intelligence and more to do with behavior.

The historical context and stories are engaging. Love the chapter on wealth vs being rich - \"Money has a greater grip on what you\'ve already earned than on what you could potentially earn.\"

Changing my view on investment strategy - focusing more on long-term sustainability rather than chasing returns.",
                'shelf_id' => $shelves->first()->id,
                'position' => 2,
                'date_added' => '2024-06-01 00:00:00',
                'last_modified' => '2024-06-27 06:00:00',
                'purchase_date' => '2024-05-25 00:00:00',
                'purchase_price' => 14.99,
                'purchase_location' => 'Kindle Store',
            ],
            // Finished with ratings and notes
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => '1984',
                'author' => 'George Orwell',
                'isbn' => '978-0451524935',
                'genre' => 'Dystopian',
                'language' => 'English',
                'publisher' => 'Signet Classic',
                'publish_year' => 1950,
                'pages' => 328,
                'format' => 'paperback',
                'spine_color_light' => '#1F2937',
                'spine_color_medium' => '#374151',
                'spine_color_dark' => '#4B5563',
                'height' => 'medium',
                'thickness' => 'regular',
                'status' => 'finished',
                'favorite' => true,
                'progress' => 100.00,
                'started_date' => '2024-03-01 00:00:00',
                'finished_date' => '2024-04-20 00:00:00',
                'personal_rating' => 5.0,
                'personal_notes' => "Chilling and thought-provoking. Orwell\'s depiction of totalitarianism feels eerily relevant today.

The concept of Newspeak and thought control is terrifying. The way the Party manipulates truth and history - \"Who controls the past controls the future: who controls the present controls the past.\"

Winston and Julia\'s rebellion feels inevitable but the ending is devastating. Room 101 scene will stay with me forever.

Essential reading for understanding the importance of truth and individual freedom.",
                'shelf_id' => $shelves->first()->id,
                'position' => 3,
                'date_added' => '2024-02-20 00:00:00',
                'last_modified' => '2024-04-20 00:00:00',
                'purchase_date' => '2024-02-15 00:00:00',
                'purchase_price' => 12.99,
                'purchase_location' => 'Bookstore',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'To Kill a Mockingbird',
                'author' => 'Harper Lee',
                'isbn' => '978-0061120084',
                'genre' => 'Classic',
                'language' => 'English',
                'publisher' => 'Harper Perennial',
                'publish_year' => 2006,
                'pages' => 336,
                'format' => 'paperback',
                'spine_color_light' => '#7C2D12',
                'spine_color_medium' => '#9A3412',
                'spine_color_dark' => '#C2410C',
                'height' => 'tall',
                'thickness' => 'regular',
                'status' => 'finished',
                'favorite' => true,
                'progress' => 100.00,
                'started_date' => '2024-02-01 00:00:00',
                'finished_date' => '2024-03-15 00:00:00',
                'personal_rating' => 5.0,
                'personal_notes' => "Beautiful, powerful, and deeply moving. Scout\'s narration brings such innocence and perspective to the heavy themes.

Atticus Finch is one of literature\'s greatest heroes - his moral courage, his parenting, his commitment to justice. \"You never really understand a person until you consider things from his point of view...until you climb into his skin and walk around in it.\"

The trial scene is incredibly powerful. The exploration of racial injustice is as relevant today as ever.

A masterpiece that should be read by everyone.",
                'shelf_id' => $shelves->first()->id,
                'position' => 4,
                'date_added' => '2024-01-20 00:00:00',
                'last_modified' => '2024-03-15 00:00:00',
                'purchase_date' => '2024-01-15 00:00:00',
                'purchase_price' => 15.99,
                'purchase_location' => 'Amazon',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'isbn' => '978-0743273565',
                'genre' => 'Classic',
                'language' => 'English',
                'publisher' => 'Scribner',
                'publish_year' => 2004,
                'pages' => 180,
                'format' => 'hardcover',
                'spine_color_light' => '#1E3A5F',
                'spine_color_medium' => '#2E5077',
                'spine_color_dark' => '#3E6B8F',
                'height' => 'short',
                'thickness' => 'thin',
                'status' => 'finished',
                'favorite' => true,
                'progress' => 100.00,
                'started_date' => '2024-01-15 00:00:00',
                'finished_date' => '2024-02-28 00:00:00',
                'personal_rating' => 4.5,
                'personal_notes' => "Fitzgerald\'s prose is absolutely gorgeous. The descriptions of Gatsby\'s parties, the colors, the atmosphere - everything is vivid and intoxicating.

The American Dream theme - the pursuit of wealth and status, the hollowness beneath the glamour. \"So we beat on, boats against the current, borne back ceaselessly into the past.\"

Nick Carraway is the perfect narrator - observant, somewhat detached but ultimately complicit.

Gatsby himself is tragic and mysterious. His obsession with Daisy and the past is both romantic and delusional.

Short but incredibly impactful.",
                'shelf_id' => $shelves->first()->id,
                'position' => 5,
                'date_added' => '2024-01-10 00:00:00',
                'last_modified' => '2024-02-28 00:00:00',
                'purchase_date' => '2024-01-05 00:00:00',
                'purchase_price' => 19.99,
                'purchase_location' => 'Bookstore',
            ],
            // More finished books with notes
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Sapiens',
                'author' => 'Yuval Noah Harari',
                'isbn' => '978-0062316097',
                'genre' => 'History',
                'language' => 'English',
                'publisher' => 'Harper',
                'publish_year' => 2015,
                'pages' => 443,
                'format' => 'hardcover',
                'spine_color_light' => '#B45309',
                'spine_color_medium' => '#D97706',
                'spine_color_dark' => '#F59E0B',
                'height' => 'tall',
                'thickness' => 'thick',
                'status' => 'finished',
                'favorite' => false,
                'progress' => 100.00,
                'started_date' => '2023-11-01 00:00:00',
                'finished_date' => '2024-01-10 00:00:00',
                'personal_rating' => 4.5,
                'personal_notes' => "Mind-blowing perspective on human history. Harari\'s ability to synthesize complex ideas into accessible narratives is remarkable.

The Cognitive Revolution - how Homo sapiens came to dominate through language and shared myths. The Agricultural Revolution as history\'s biggest fraud - fascinating argument.

The unification of humankind through money, empires, and religion. The future of humans and the potential for artificial life.

Changed how I think about human progress and the cost of civilization. Some controversial takes but always thought-provoking.",
                'shelf_id' => $shelves->slice(1, 1)->first()->id,
                'position' => 0,
                'date_added' => '2023-10-20 00:00:00',
                'last_modified' => '2024-01-10 00:00:00',
                'purchase_date' => '2023-10-15 00:00:00',
                'purchase_price' => 28.99,
                'purchase_location' => 'Amazon',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Thinking, Fast and Slow',
                'author' => 'Daniel Kahneman',
                'isbn' => '978-0374533557',
                'genre' => 'Psychology',
                'language' => 'English',
                'publisher' => 'Farrar, Straus and Giroux',
                'publish_year' => 2013,
                'pages' => 499,
                'format' => 'paperback',
                'spine_color_light' => '#581C87',
                'spine_color_medium' => '#7C3AED',
                'spine_color_dark' => '#8B5CF6',
                'height' => 'medium',
                'thickness' => 'regular',
                'status' => 'finished',
                'favorite' => false,
                'progress' => 100.00,
                'started_date' => '2023-10-01 00:00:00',
                'finished_date' => '2023-12-05 00:00:00',
                'personal_rating' => 4.0,
                'personal_notes' => "Dense but incredibly insightful. Kahneman breaks down the two systems of thinking - System 1 (fast, intuitive) and System 2 (slow, deliberate).

The cognitive biases explained are eye-opening: anchoring, availability heuristic, loss aversion, framing effects. \"Losses loom larger than gains\" - so true in decision-making.

Prospect theory and how we make judgments under uncertainty. The ending about happiness and experiencing vs remembering self is profound.

Academic in parts but the insights are invaluable for understanding human behavior.",
                'shelf_id' => $shelves->slice(1, 1)->first()->id,
                'position' => 1,
                'date_added' => '2023-09-25 00:00:00',
                'last_modified' => '2023-12-05 00:00:00',
                'purchase_date' => '2023-09-20 00:00:00',
                'purchase_price' => 17.99,
                'purchase_location' => 'Bookstore',
            ],
            // Wishlist / Unread books
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Project Hail Mary',
                'author' => 'Andy Weir',
                'isbn' => '978-0593135204',
                'genre' => 'Science Fiction',
                'language' => 'English',
                'publisher' => 'Ballantine Books',
                'publish_year' => 2021,
                'pages' => 476,
                'format' => 'hardcover',
                'spine_color_light' => '#0369A1',
                'spine_color_medium' => '#0EA5E9',
                'spine_color_dark' => '#38BDF8',
                'height' => 'tall',
                'thickness' => 'regular',
                'status' => 'wishlist',
                'favorite' => false,
                'personal_notes' => "Heard amazing things about this! Loved The Martian so really excited to read this.

Supposedly has great science, humor, and an unlikely friendship. Can\'t wait to dive in when I finish my current reads.",
                'shelf_id' => $shelves->slice(1, 1)->first()->id,
                'position' => 2,
                'date_added' => '2024-05-20 00:00:00',
                'last_modified' => '2024-05-20 00:00:00',
                'purchase_date' => null,
                'purchase_price' => null,
                'purchase_location' => null,
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'The Midnight Library',
                'author' => 'Matt Haig',
                'isbn' => '978-0525559474',
                'genre' => 'Fiction',
                'language' => 'English',
                'publisher' => 'Viking',
                'publish_year' => 2020,
                'pages' => 304,
                'format' => 'paperback',
                'spine_color_light' => '#7E22CE',
                'spine_color_medium' => '#A855F7',
                'spine_color_dark' => '#C084FC',
                'height' => 'short',
                'thickness' => 'thin',
                'status' => 'wishlist',
                'favorite' => false,
                'personal_notes' => "Interesting premise about a library between life and death where you can explore all the lives you could have lived.

Themes of regret, choices, and finding meaning. Sounds like a thought-provoking read about the paths not taken.",
                'shelf_id' => $shelves->slice(1, 1)->first()->id,
                'position' => 3,
                'date_added' => '2024-05-25 00:00:00',
                'last_modified' => '2024-05-25 00:00:00',
                'purchase_date' => null,
                'purchase_price' => null,
                'purchase_location' => null,
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Educated',
                'author' => 'Tara Westover',
                'isbn' => '978-0399590504',
                'genre' => 'Memoir',
                'language' => 'English',
                'publisher' => 'Random House',
                'publish_year' => 2018,
                'pages' => 352,
                'format' => 'paperback',
                'spine_color_light' => '#047857',
                'spine_color_medium' => '#10B981',
                'spine_color_dark' => '#34D399',
                'height' => 'medium',
                'thickness' => 'regular',
                'status' => 'unread',
                'favorite' => false,
                'personal_notes' => "Memoir about growing up in a survivalist family in rural Idaho and eventually leaving to get education.

Heard it\'s incredibly powerful and inspiring. Story about the importance of education and family bonds vs abuse.",
                'shelf_id' => $shelves->slice(1, 1)->first()->id,
                'position' => 4,
                'date_added' => '2024-06-01 00:00:00',
                'last_modified' => '2024-06-01 00:00:00',
                'purchase_date' => '2024-05-28 00:00:00',
                'purchase_price' => 17.99,
                'purchase_location' => 'Amazon',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'The Alchemist',
                'author' => 'Paulo Coelho',
                'isbn' => '978-0062315007',
                'genre' => 'Fiction',
                'language' => 'English',
                'publisher' => 'HarperOne',
                'publish_year' => 2014,
                'pages' => 208,
                'format' => 'paperback',
                'spine_color_light' => '#B91C1C',
                'spine_color_medium' => '#EF4444',
                'spine_color_dark' => '#F87171',
                'height' => 'short',
                'thickness' => 'thin',
                'status' => 'unread',
                'favorite' => false,
                'personal_notes' => "Classic philosophical novel about following your dreams and personal legend.

Short but supposedly very inspiring. \"When you want something, all the universe conspires in helping you to achieve it.\"",
                'shelf_id' => $shelves->slice(1, 1)->first()->id,
                'position' => 5,
                'date_added' => '2024-06-05 00:00:00',
                'last_modified' => '2024-06-05 00:00:00',
                'purchase_date' => '2024-06-01 00:00:00',
                'purchase_price' => 14.99,
                'purchase_location' => 'Bookstore',
            ],
            // Business & Finance
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Rich Dad Poor Dad',
                'author' => 'Robert Kiyosaki',
                'isbn' => '978-1612680194',
                'genre' => 'Finance',
                'language' => 'English',
                'publisher' => 'Plata Publishing',
                'publish_year' => 2017,
                'pages' => 336,
                'format' => 'paperback',
                'spine_color_light' => '#92400E',
                'spine_color_medium' => '#B45309',
                'spine_color_dark' => '#D97706',
                'height' => 'medium',
                'thickness' => 'regular',
                'status' => 'finished',
                'favorite' => false,
                'progress' => 100.00,
                'started_date' => '2023-10-15 00:00:00',
                'finished_date' => '2023-11-20 00:00:00',
                'personal_rating' => 3.5,
                'personal_notes' => "Simple but powerful concepts about assets vs liabilities, financial literacy, and mindset.

The story format makes it accessible. Core message: make your money work for you rather than working for money.

Some criticism for being light on specific advice but great for mindset shift. Good starting point for financial education.",
                'shelf_id' => $shelves->slice(2, 1)->first()->id,
                'position' => 0,
                'date_added' => '2023-10-05 00:00:00',
                'last_modified' => '2023-11-20 00:00:00',
                'purchase_date' => '2023-10-01 00:00:00',
                'purchase_price' => 18.99,
                'purchase_location' => 'Bookstore',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'The Four Hour Work Week',
                'author' => 'Tim Ferriss',
                'isbn' => '978-0307465131',
                'genre' => 'Business',
                'language' => 'English',
                'publisher' => 'Crown Currency',
                'publish_year' => 2009,
                'pages' => 416,
                'format' => 'paperback',
                'spine_color_light' => '#065F46',
                'spine_color_medium' => '#10B981',
                'spine_color_dark' => '#34D399',
                'height' => 'short',
                'thickness' => 'thin',
                'status' => 'finished',
                'favorite' => false,
                'progress' => 100.00,
                'started_date' => '2023-09-20 00:00:00',
                'finished_date' => '2023-10-15 00:00:00',
                'personal_rating' => 3.0,
                'personal_notes' => "Some useful ideas about lifestyle design and automation, but feels dated and unrealistic for most people.

The DEAL framework is interesting: Definition, Elimination, Automation, Liberation.

Good sections on outsourcing and mini-retirements. Some of the income generation ideas are sketchy.

Take what works and ignore the hype. Not a 4-hour work week for 99% of people but still has productivity gems.",
                'shelf_id' => $shelves->slice(2, 1)->first()->id,
                'position' => 1,
                'date_added' => '2023-09-10 00:00:00',
                'last_modified' => '2023-10-15 00:00:00',
                'purchase_date' => '2023-09-05 00:00:00',
                'purchase_price' => 16.99,
                'purchase_location' => 'Amazon',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Deep Work',
                'author' => 'Cal Newport',
                'isbn' => '978-1455586691',
                'genre' => 'Productivity',
                'language' => 'English',
                'publisher' => 'Grand Central Publishing',
                'publish_year' => 2016,
                'pages' => 304,
                'format' => 'paperback',
                'spine_color_light' => '#1E3A8A',
                'spine_color_medium' => '#3B82F6',
                'spine_color_dark' => '#60A5FA',
                'height' => 'medium',
                'thickness' => 'regular',
                'status' => 'finished',
                'favorite' => false,
                'progress' => 100.00,
                'started_date' => '2023-08-25 00:00:00',
                'finished_date' => '2023-09-28 00:00:00',
                'personal_rating' => 4.5,
                'personal_notes' => "Excellent book on focused productivity in an age of constant distraction.

Newport makes a compelling case for deep work: \"Professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit.\"

The four rules of deep work are practical: Work Deeply, Embrace Boredom, Quit Social Media, Drain the Shallows.

Already implementing shutdown rituals and deep work blocks. This book actually delivers on its promises.",
                'shelf_id' => $shelves->slice(2, 1)->first()->id,
                'position' => 2,
                'date_added' => '2023-08-15 00:00:00',
                'last_modified' => '2023-09-28 00:00:00',
                'purchase_date' => '2023-08-10 00:00:00',
                'purchase_price' => 17.99,
                'purchase_location' => 'Bookstore',
            ],
            // Additional diverse books
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'The Design of Everyday Things',
                'author' => 'Don Norman',
                'isbn' => '978-0465050659',
                'genre' => 'Design',
                'language' => 'English',
                'publisher' => 'Basic Books',
                'publish_year' => 2013,
                'pages' => 368,
                'format' => 'paperback',
                'spine_color_light' => '#DC2626',
                'spine_color_medium' => '#F87171',
                'spine_color_dark' => '#EF4444',
                'height' => 'medium',
                'thickness' => 'regular',
                'status' => 'finished',
                'favorite' => true,
                'progress' => 100.00,
                'started_date' => '2023-12-01 00:00:00',
                'finished_date' => '2024-01-15 00:00:00',
                'personal_rating' => 5.0,
                'personal_notes' => "Essential reading for anyone who designs anything. Norman explains why some doors are hard to open and some interfaces are frustrating.

The seven fundamental principles of design: discoverability, understanding, feedback, constraints, affordances, mapping, and consistency.

Changed how I evaluate products and interfaces. \"Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible.\"

Should be required reading for all designers and engineers.",
                'shelf_id' => $shelves->slice(2, 1)->first()->id,
                'position' => 3,
                'date_added' => '2023-11-20 00:00:00',
                'last_modified' => '2024-01-15 00:00:00',
                'purchase_date' => '2023-11-15 00:00:00',
                'purchase_price' => 21.99,
                'purchase_location' => 'Amazon',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Start with Why',
                'author' => 'Simon Sinek',
                'isbn' => '978-1591846444',
                'genre' => 'Leadership',
                'language' => 'English',
                'publisher' => 'Portfolio',
                'publish_year' => 2011,
                'pages' => 256,
                'format' => 'hardcover',
                'spine_color_light' => '#0F766E',
                'spine_color_medium' => '#14B8A6',
                'spine_color_dark' => '#2DD4BF',
                'height' => 'short',
                'thickness' => 'thin',
                'status' => 'reading',
                'favorite' => false,
                'current_page' => 45,
                'progress' => 17.58,
                'started_date' => '2024-06-20 10:30:00',
                'personal_rating' => 3.5,
                'personal_notes' => "Exploring the concept of starting with \"why\" - the purpose, cause, or belief that drives every organization and individual.

The Golden Circle: Why (center), How (middle), What (outer). Most companies start from the outside in; inspiring leaders start from the inside out.

Some good examples with Apple, Martin Luther King Jr., and the Wright brothers. A bit repetitive but the core idea is solid.",
                'shelf_id' => $shelves->first()->id,
                'position' => 3,
                'date_added' => '2024-06-15 00:00:00',
                'last_modified' => '2024-06-27 06:00:00',
                'purchase_date' => '2024-06-10 00:00:00',
                'purchase_price' => 23.99,
                'purchase_location' => 'Bookstore',
            ],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => $user->id,
                'title' => 'Zero to One',
                'author' => 'Peter Thiel',
                'isbn' => '978-0804139298',
                'genre' => 'Business',
                'language' => 'English',
                'publisher' => 'Crown Business',
                'publish_year' => 2014,
                'pages' => 224,
                'format' => 'hardcover',
                'spine_color_light' => '#BE185D',
                'spine_color_medium' => '#EC4899',
                'spine_color_dark' => '#F472B6',
                'height' => 'short',
                'thickness' => 'thin',
                'status' => 'wishlist',
                'favorite' => false,
                'personal_notes' => "Notes from a Stanford course on startups. Thiel\'s contrarian takes on business and innovation.

Key concept: going from zero to one (vertical progress) vs one to n (horizontal progress). Monopoly as the condition of every successful business.

Want to read for his perspectives on competition, power laws, and building the future.",
                'shelf_id' => $shelves->slice(2, 1)->first()->id,
                'position' => 4,
                'date_added' => '2024-06-10 00:00:00',
                'last_modified' => '2024-06-10 00:00:00',
                'purchase_date' => null,
                'purchase_price' => null,
                'purchase_location' => null,
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }

        $this->command->info('Book detail seeder completed successfully.');
        $this->command->info('Seeded ' . count($books) . ' books with detailed information including ratings and notes.');
    }
}
