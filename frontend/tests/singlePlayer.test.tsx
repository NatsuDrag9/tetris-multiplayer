import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SinglePlayer from '@pages/SinglePlayer/SinglePlayer';
import render from './setupTests';
import { cleanup, fireEvent } from '@testing-library/react';
import * as gameHelpers from '@utils/game-helpers';
import {
  CLEAR_CELL,
  GameMode,
  KEY_CODE_LEFT,
  KEY_CODE_RIGHT,
  KEY_CODE_UP,
} from '@constants/game';
import { Tetromino } from '@customTypes/tetromonoTypes';
import * as usePiece from '@hooks/usePiece';
import * as useStage from '@hooks/useStage';

const testTetromino: Tetromino = {
  shape: [
    [0, 'I'],
    [0, 'I'],
  ],
  color: '80, 227, 230',
};

const TEST_STAGE_WIDTH = 6;
const TEST_STAGE_HEIGHT = 10;

vi.mock('@hooks/usePiece');
vi.mock('@hooks/useStage');

describe('Single player tests', () => {
  beforeEach(() => {
    // Mocking usePiece to control the piece's initial position and movement
    usePiece.default = vi.fn().mockReturnValue({
      piece: {
        // A piece on the stage has x position at TEST_STAGE_WIDTH - 2 (as tetromino is a 2X2 matrix)
        position: { x: TEST_STAGE_WIDTH - 2, y: 0 },
        tetromino: [
          [0, 'I'],
          [0, 'I'],
        ],
        collided: false,
      },
      updatePiecePosition: vi.fn(),
      resetPiece: vi.fn(),
      pieceRotate: vi.fn(),
    });
    // vi.spyOn(usePiece, 'default').mockImplementation(mockUsePiece);

    // Mock useStage to provide a typical stage setup
    useStage.default = vi.fn().mockReturnValue({
      stage: Array.from(Array(TEST_STAGE_HEIGHT), () =>
        new Array(TEST_STAGE_WIDTH).fill([0, 'CLEAR'])
      ),
      setStage: vi.fn(),
      rowsCleared: 0,
    });
  });

  afterEach(() => {
    cleanup;
    // vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  test('Assert initial values of game variables displayed on screen', () => {
    const { getByTestId } = render(<SinglePlayer />);
    const scoreDisplay = getByTestId('singleplayer-score');
    const rowsClearedDisplay = getByTestId('singleplayer-rows-cleared');
    const levelDisplay = getByTestId('singleplayer-level');

    // Check that the mock values are displayed correctly
    expect(scoreDisplay.innerHTML).toBe('0');
    expect(rowsClearedDisplay.innerHTML).toBe('0');
    expect(levelDisplay.innerHTML).toBe('1');
  });

  test('Assert collision between piece and stage boundary', () => {
    // Mocking usePiece to control the piece's initial position and movement
    vi.mock('@hooks/usePiece', () => {
      const TEST_STAGE_WIDTH = 6;
      return {
        default: vi.fn().mockReturnValue({
          piece: {
            // An 4[] piece on the stage has x position at TEST_STAGE_WIDTH - 2 (as tetromino is a 2X2 matrix)
            position: { x: TEST_STAGE_WIDTH - 2, y: 0 },
            tetromino: [
              [0, 'I'],
              [0, 'I'],
            ],
            collided: false,
          },
          updatePiecePosition: vi.fn(),
          resetPiece: vi.fn(),
          pieceRotate: vi.fn(),
        }),
      };
    });

    const { getByTestId } = render(<SinglePlayer />);
    const spyOnCheckCollision = vi.spyOn(gameHelpers, 'checkCollision');

    // Start the game
    fireEvent.click(getByTestId('singleplayer-start-game'));

    // Right arrow key to move the piece towards right
    fireEvent.keyDown(getByTestId('singleplayer-container'), {
      key: 'ArrowRight',
      keyCode: KEY_CODE_RIGHT,
    });

    // Check whether checkCollision is called with the correct piece
    const testPiece = {
      position: { x: TEST_STAGE_WIDTH - 2, y: 0 },
      tetromino: testTetromino.shape,
      collided: false,
    };
    const testStage = Array.from(Array(TEST_STAGE_HEIGHT), () =>
      new Array(TEST_STAGE_WIDTH).fill([0, CLEAR_CELL])
    );

    expect(spyOnCheckCollision).toHaveBeenCalledWith(testPiece, testStage, {
      x: 1,
      y: 0,
    });
    expect(spyOnCheckCollision).toHaveReturnedWith(true);
  });
});

describe('Keyboard input tests', () => {
  beforeEach(() => {
    // Mock useStage to provide a typical stage setup
    useStage.default = vi.fn().mockReturnValue({
      stage: Array.from(Array(TEST_STAGE_HEIGHT), () =>
        new Array(TEST_STAGE_WIDTH).fill([0, 'CLEAR'])
      ),
      setStage: vi.fn(),
      rowsCleared: 0,
    });

    // Mocking usePiece to control the piece's initial position and movement
    usePiece.default = vi.fn().mockReturnValue({
      piece: {
        // A piece on the stage has x position at TEST_STAGE_WIDTH - 2 (as tetromino is a 2X2 matrix)
        position: { x: TEST_STAGE_WIDTH - 4, y: 0 },
        tetromino: [
          [0, 'I'],
          [0, 'I'],
        ],
        collided: false,
      },
      updatePiecePosition: vi.fn(),
      resetPiece: vi.fn(),
      pieceRotate: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup;
    vi.restoreAllMocks();
  });

  test('Move tetromino piece to right', () => {
    // Mocking usePiece to control the piece's initial position and movement
    vi.mock('@hooks/usePiece', () => {
      const TEST_STAGE_WIDTH = 6;
      return {
        default: vi.fn().mockReturnValue({
          piece: {
            // An existing piece on the stage has x position at TEST_STAGE_WIDTH - 4
            position: { x: TEST_STAGE_WIDTH - 4, y: 0 },
            tetromino: [
              [0, 'I'],
              [0, 'I'],
            ],
            collided: false,
          },
          updatePiecePosition: vi.fn(),
          resetPiece: vi.fn(),
          pieceRotate: vi.fn(),
        }),
      };
    });

    const { getByTestId } = render(<SinglePlayer />);
    const spyOnCheckCollision = vi.spyOn(gameHelpers, 'checkCollision');

    // Start the game
    fireEvent.click(getByTestId('singleplayer-start-game'));

    // Fire ArrowRight key event
    fireEvent.keyDown(getByTestId('singleplayer-container'), {
      key: 'ArrowRight',
      keyCode: KEY_CODE_RIGHT,
    });

    const testPiece = {
      position: { x: TEST_STAGE_WIDTH - 4, y: 0 },
      tetromino: testTetromino.shape,
      collided: false,
    };
    const testStage = Array.from(Array(TEST_STAGE_HEIGHT), () =>
      new Array(TEST_STAGE_WIDTH).fill([0, CLEAR_CELL])
    );

    // Assert that spyOnCollision is called with correct arguments
    expect(spyOnCheckCollision).toHaveBeenCalledWith(testPiece, testStage, {
      x: 1,
      y: 0,
    });
    expect(spyOnCheckCollision).toHaveReturnedWith(false);

    // Assert that updatePiecePosition was called with the correct arguments
    expect(
      usePiece.default(GameMode.SINGLE_PLAYER).updatePiecePosition
    ).toHaveBeenCalledWith({
      x: 1,
      y: 0,
      collided: false, // Ensure the collided flag is correctly passed
    });
  });

  test('Move tetromino piece to left', () => {
    // Mocking usePiece to control the piece's initial position and movement
    vi.mock('@hooks/usePiece', () => {
      const TEST_STAGE_WIDTH = 6;
      return {
        default: vi.fn().mockReturnValue({
          piece: {
            // An existing piece on the stage has x position at TEST_STAGE_WIDTH - 4
            position: { x: TEST_STAGE_WIDTH - 4, y: 0 },
            tetromino: [
              [0, 'I'],
              [0, 'I'],
            ],
            collided: false,
          },
          updatePiecePosition: vi.fn(),
          resetPiece: vi.fn(),
          pieceRotate: vi.fn(),
        }),
      };
    });

    const { getByTestId } = render(<SinglePlayer />);
    const spyOnCheckCollision = vi.spyOn(gameHelpers, 'checkCollision');

    // Start the game
    fireEvent.click(getByTestId('singleplayer-start-game'));

    // Fire ArrowRight key event
    fireEvent.keyDown(getByTestId('singleplayer-container'), {
      key: 'ArrowLeft',
      keyCode: KEY_CODE_LEFT,
    });

    const testPiece = {
      position: { x: TEST_STAGE_WIDTH - 4, y: 0 },
      tetromino: testTetromino.shape,
      collided: false,
    };
    const testStage = Array.from(Array(TEST_STAGE_HEIGHT), () =>
      new Array(TEST_STAGE_WIDTH).fill([0, CLEAR_CELL])
    );

    // Assert that spyOnCollision is called with correct arguments
    expect(spyOnCheckCollision).toHaveBeenCalledWith(testPiece, testStage, {
      x: -1,
      y: 0,
    });
    expect(spyOnCheckCollision).toHaveReturnedWith(false);

    // Assert that updatePiecePosition was called with the correct arguments
    expect(
      usePiece.default(GameMode.SINGLE_PLAYER).updatePiecePosition
    ).toHaveBeenCalledWith({
      x: -1,
      y: 0,
      collided: false, // Ensure the collided flag is correctly passed
    });
  });

  test('Rotate piece when keyUp is pressed', () => {
    // Mocking usePiece to control the piece's initial position and movement
    vi.mock('@hooks/usePiece', () => {
      const TEST_STAGE_WIDTH = 6;
      return {
        default: vi.fn().mockReturnValue({
          piece: {
            // An existing piece on the stage has x position at TEST_STAGE_WIDTH - 4
            position: { x: TEST_STAGE_WIDTH - 4, y: 2 },
            tetromino: [
              [0, 'I'],
              [0, 'I'],
            ],
            collided: false,
          },
          updatePiecePosition: vi.fn(),
          resetPiece: vi.fn(),
          pieceRotate: vi.fn(),
        }),
      };
    });

    const { getByTestId } = render(<SinglePlayer />);

    // Start the game
    fireEvent.click(getByTestId('singleplayer-start-game'));

    // Fire ArrowRight key event
    fireEvent.keyDown(getByTestId('singleplayer-container'), {
      key: 'ArrowUp',
      keyCode: KEY_CODE_UP,
    });
    const testStage = Array.from(Array(TEST_STAGE_HEIGHT), () =>
      new Array(TEST_STAGE_WIDTH).fill([0, CLEAR_CELL])
    );

    // Assert that updatePiecePosition was called with the correct arguments
    expect(
      usePiece.default(GameMode.SINGLE_PLAYER).pieceRotate
    ).toHaveBeenCalledWith(testStage, 1);
  });
});
